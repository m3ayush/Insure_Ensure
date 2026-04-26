import crypto from "crypto";
import { Router } from "express";
import admin from "../config/firebaseAdmin.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = Router();

const SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000;

function ipHash(req) {
  const raw = req.ip || req.headers["x-forwarded-for"] || "";
  return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

// ── Rate-limit store for /login-failed (unauthenticated endpoint) ────────────
const loginFailedBuckets = new Map();
function checkLoginFailedRate(email) {
  const now = Date.now();
  const bucket = loginFailedBuckets.get(email) || { calls: [], lockedUntil: 0 };
  if (bucket.lockedUntil > now) return false;
  bucket.calls = bucket.calls.filter((t) => now - t < 5 * 60_000);
  if (bucket.calls.length >= 5) {
    bucket.lockedUntil = now + 5 * 60_000;
    loginFailedBuckets.set(email, bucket);
    return false;
  }
  bucket.calls.push(now);
  loginFailedBuckets.set(email, bucket);
  return true;
}

// ── POST /api/auth/session ────────────────────────────────────────────────────
router.post("/session", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken || typeof idToken !== "string") {
    return res.status(400).json({ success: false, message: "idToken is required" });
  }

  let uid;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      return res.status(401).json({
        success: false,
        message: "Recent sign-in required. Please sign in again.",
      });
    }
    uid = decoded.uid;

    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });

    res.cookie("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION_MS,
      path: "/",
    });

    // Write session record
    const sessionRef = await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("sessions")
      .add({
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        last_seen: admin.firestore.FieldValue.serverTimestamp(),
        user_agent: (req.headers["user-agent"] || "unknown").slice(0, 200),
        ip_hash: ipHash(req),
        is_revoked: false,
      });

    // Login audit log (success)
    admin.firestore().collection("login_attempts").add({
      uid,
      outcome: "success",
      ip_hash: ipHash(req),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      session_id: sessionRef.id,
    }).catch(() => {});

    // Reset failed_login_attempts counter
    admin.firestore().collection("users").doc(uid).update({
      failed_login_attempts: 0,
      last_login_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {});

    res.json({ success: true });
  } catch {
    // Login audit log (failure — uid unknown when token is invalid)
    admin.firestore().collection("login_attempts").add({
      uid: uid || null,
      outcome: "failed_invalid_token",
      ip_hash: ipHash(req),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {});

    res.status(401).json({ success: false, message: "Invalid token. Please sign in again." });
  }
});

// ── POST /api/auth/login-failed ──────────────────────────────────────────────
// Called from client when Firebase client-side login fails (wrong password, etc.)
// Unauthenticated — rate-limited per email to prevent abuse.
router.post("/login-failed", async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, message: "email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!checkLoginFailedRate(normalizedEmail)) {
    return res.status(429).json({ success: false, message: "Too many requests" });
  }

  try {
    const user = await admin.auth().getUserByEmail(normalizedEmail);
    await admin.firestore().collection("users").doc(user.uid).update({
      failed_login_attempts: admin.firestore.FieldValue.increment(1),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    admin.firestore().collection("login_attempts").add({
      uid: user.uid,
      outcome: "failed_wrong_credentials",
      ip_hash: ipHash(req),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {});
  } catch {
    // If user not found: log with no uid (don't reveal existence)
    admin.firestore().collection("login_attempts").add({
      uid: null,
      outcome: "failed_user_not_found",
      ip_hash: ipHash(req),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {});
  }

  res.json({ success: true });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post("/logout", verifyAuth, async (req, res) => {
  try {
    await admin.auth().revokeRefreshTokens(req.uid);
    // Mark all active sessions as revoked
    const sessions = await admin
      .firestore()
      .collection("users")
      .doc(req.uid)
      .collection("sessions")
      .where("is_revoked", "==", false)
      .get();
    const batch = admin.firestore().batch();
    sessions.forEach((doc) =>
      batch.update(doc.ref, {
        is_revoked: true,
        revoked_at: admin.firestore.FieldValue.serverTimestamp(),
      })
    );
    if (!sessions.empty) await batch.commit();
  } catch {
    // Non-fatal: still clear the cookie.
  }
  res.clearCookie("session", { path: "/" });
  res.json({ success: true });
});

// ── POST /api/auth/revoke ─────────────────────────────────────────────────────
router.post("/revoke", verifyAuth, async (req, res) => {
  try {
    await admin.auth().revokeRefreshTokens(req.uid);
    const sessions = await admin
      .firestore()
      .collection("users")
      .doc(req.uid)
      .collection("sessions")
      .where("is_revoked", "==", false)
      .get();
    const batch = admin.firestore().batch();
    sessions.forEach((doc) =>
      batch.update(doc.ref, {
        is_revoked: true,
        revoked_at: admin.firestore.FieldValue.serverTimestamp(),
      })
    );
    if (!sessions.empty) await batch.commit();
    res.clearCookie("session", { path: "/" });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: "Failed to revoke sessions" });
  }
});

// ── DELETE /api/auth/account ──────────────────────────────────────────────────
// Soft-deletes the account: sets is_active = false, revokes all sessions.
router.delete("/account", verifyAuth, async (req, res) => {
  try {
    await admin.firestore().collection("users").doc(req.uid).update({
      is_active: false,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    await admin.auth().revokeRefreshTokens(req.uid);
    res.clearCookie("session", { path: "/" });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete account" });
  }
});

export default router;
