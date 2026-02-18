import { Router } from "express";
import multer from "multer";
import { chatRateLimiter } from "../middleware/rateLimiter.js";
import ReimbursementAudit from "../models/ReimbursementAudit.js";
import {
  extractDischargeSummary,
  setSessionUid,
  getSession,
  selectInsurer,
  addDocument,
  getAvailableInsurers,
} from "../services/reimbursementService.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and PDF files are allowed"));
    }
  },
});

function handleMulterError(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File size must be under 5MB" });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}

// ── Upload primary document (Discharge Summary) ─────────────

router.post("/upload-primary", handleMulterError, chatRateLimiter, async (req, res) => {
  const firebase_uid = req.body.firebase_uid;

  if (!firebase_uid || typeof firebase_uid !== "string") {
    return res.status(400).json({ success: false, message: "firebase_uid is required" });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    const result = await extractDischargeSummary(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    setSessionUid(result.sessionId, firebase_uid);

    // Persist to MongoDB (async, non-blocking)
    ReimbursementAudit.create({
      firebase_uid,
      session_id: result.sessionId,
      extracted_data: result.extractedData,
      uploaded_docs: [{ doc_id: "discharge_summary", file_name: req.file.originalname }],
      score: result.score,
      score_breakdown: result.scoreBreakdown,
      missing_docs: result.missing,
      status: result.insurer ? "checklist_ready" : "extracted",
    }).catch((err) => console.error("[REIMB] DB save error:", err.message));

    res.json({
      success: true,
      sessionId: result.sessionId,
      extractedData: result.extractedData,
      insurer: result.insurer,
      insurers: result.insurer ? null : getAvailableInsurers(),
      score: result.score,
      scoreBreakdown: result.scoreBreakdown,
      missing: result.missing,
      fileName: req.file.originalname,
    });
  } catch (err) {
    console.error("[REIMB] Upload error:", err.message);
    const status = err.message.includes("Could not extract") ? 422 : 500;
    res.status(status).json({
      success: false,
      message: err.message || "Failed to process document",
    });
  }
});

// ── Select insurer manually (fallback) ──────────────────────

router.post("/select-insurer", chatRateLimiter, async (req, res) => {
  const { firebase_uid, session_id, insurer_key } = req.body;

  if (!firebase_uid || !session_id || !insurer_key) {
    return res.status(400).json({ success: false, message: "firebase_uid, session_id, and insurer_key are required" });
  }

  const result = selectInsurer(session_id, insurer_key);
  if (!result) {
    return res.status(404).json({ success: false, message: "Session expired or insurer not found" });
  }

  // Update MongoDB (async)
  ReimbursementAudit.findOneAndUpdate(
    { session_id },
    {
      "extracted_data.insurer_key": insurer_key,
      "extracted_data.insurer_name": result.insurer.display_name,
      score: result.score,
      score_breakdown: result.scoreBreakdown,
      missing_docs: result.missing,
      status: "checklist_ready",
    }
  ).catch((err) => console.error("[REIMB] DB update error:", err.message));

  res.json({ success: true, ...result });
});

// ── Upload additional document against checklist ────────────

router.post("/upload-doc", handleMulterError, chatRateLimiter, async (req, res) => {
  const { firebase_uid, session_id, doc_id } = req.body;

  if (!firebase_uid || !session_id || !doc_id) {
    return res.status(400).json({
      success: false,
      message: "firebase_uid, session_id, and doc_id are required",
    });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const result = addDocument(session_id, doc_id, req.file.originalname);
  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Session expired or not found. Please start a new audit.",
    });
  }

  // Update MongoDB (async)
  ReimbursementAudit.findOneAndUpdate(
    { session_id },
    {
      $push: { uploaded_docs: { doc_id, file_name: req.file.originalname } },
      $set: {
        score: result.score,
        score_breakdown: result.scoreBreakdown,
        missing_docs: result.missing,
        status: result.missing.length === 0 ? "analysis_complete" : "checklist_ready",
      },
    }
  ).catch((err) => console.error("[REIMB] DB update error:", err.message));

  res.json({
    success: true,
    uploadedDocIds: result.uploadedDocIds,
    score: result.score,
    scoreBreakdown: result.scoreBreakdown,
    missing: result.missing,
  });
});

// ── Get audit history ───────────────────────────────────────

router.get("/history/:uid", async (req, res) => {
  try {
    const audits = await ReimbursementAudit.find({ firebase_uid: req.params.uid })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.json({ success: true, data: audits });
  } catch (err) {
    console.error("[REIMB] History fetch error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch history" });
  }
});

export default router;
