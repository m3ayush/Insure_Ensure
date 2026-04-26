import admin from "../config/firebaseAdmin.js";

export async function verifyAuth(req, res, next) {
  const sessionCookie = req.cookies?.session;

  if (!sessionCookie) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.uid = decoded.uid;
    next();
  } catch {
    res.clearCookie("session");
    return res.status(401).json({ success: false, message: "Session expired. Please sign in again." });
  }
}
