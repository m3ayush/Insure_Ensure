import { Router } from "express";
import multer from "multer";
import {
  extractDocument,
  answerDocumentQuestion,
  isSessionValid,
  setSessionUid,
} from "../services/documentService.js";
import { chatRateLimiter } from "../middleware/rateLimiter.js";
import DocumentChatMessage from "../models/DocumentChatMessage.js";

const router = Router();

// Multer config: memory storage, 5MB limit, accept only jpg/png/pdf
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

// ── Upload endpoint ─────────────────────────────────────────

router.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File size must be under 5MB" });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, chatRateLimiter, async (req, res) => {
  const firebase_uid = req.body.firebase_uid;

  if (!firebase_uid || typeof firebase_uid !== "string") {
    return res.status(400).json({ success: false, message: "firebase_uid is required" });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    const result = await extractDocument(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    setSessionUid(result.sessionId, firebase_uid);

    // Log async
    DocumentChatMessage.create({
      firebase_uid,
      session_id: result.sessionId,
      action: "upload",
      file_name: req.file.originalname,
      response: result.documentSummary,
      response_time_ms: result.responseTimeMs,
    }).catch((err) => console.error("Document chat log error:", err.message));

    res.json({
      success: true,
      sessionId: result.sessionId,
      documentSummary: result.documentSummary,
      fileName: req.file.originalname,
      suggestedQuestions: result.suggestedQuestions,
    });
  } catch (err) {
    console.error("Document upload error:", err.message);
    const status = err.message.includes("Could not extract") ? 422 : 500;
    res.status(status).json({
      success: false,
      message: err.message || "Failed to process document",
    });
  }
});

// ── Ask endpoint ────────────────────────────────────────────

function validateAskRequest(req, res, next) {
  const { firebase_uid, sessionId, message, conversationHistory } = req.body;

  if (!firebase_uid || typeof firebase_uid !== "string") {
    return res.status(400).json({ success: false, message: "firebase_uid is required" });
  }

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ success: false, message: "sessionId is required" });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({ success: false, message: "message is required" });
  }

  const trimmed = message.trim();
  if (trimmed.length === 0 || trimmed.length > 800) {
    return res.status(400).json({
      success: false,
      message: "Message must be between 1 and 800 characters",
    });
  }
  req.body.message = trimmed;

  // Validate and trim conversation history
  if (conversationHistory !== undefined) {
    if (!Array.isArray(conversationHistory)) {
      return res.status(400).json({
        success: false,
        message: "conversationHistory must be an array",
      });
    }

    const validRoles = new Set(["user", "assistant"]);
    const sanitized = [];

    for (const entry of conversationHistory.slice(-10)) {
      if (
        entry &&
        typeof entry.role === "string" &&
        validRoles.has(entry.role) &&
        typeof entry.content === "string" &&
        entry.content.trim().length > 0
      ) {
        sanitized.push({ role: entry.role, content: entry.content.trim() });
      }
    }

    req.body.conversationHistory = sanitized;
  } else {
    req.body.conversationHistory = [];
  }

  next();
}

router.post("/ask", validateAskRequest, chatRateLimiter, async (req, res) => {
  const { firebase_uid, sessionId, message, conversationHistory } = req.body;

  if (!isSessionValid(sessionId)) {
    return res.status(404).json({
      success: false,
      message: "Document session expired or not found. Please upload your document again.",
    });
  }

  try {
    const result = await answerDocumentQuestion(sessionId, message, conversationHistory);

    // Log async
    DocumentChatMessage.create({
      firebase_uid,
      session_id: sessionId,
      action: "ask",
      query: message,
      response: result.response,
      response_time_ms: result.responseTimeMs,
      error: result.error || null,
    }).catch((err) => console.error("Document chat log error:", err.message));

    res.json({
      success: true,
      response: result.response,
    });
  } catch (err) {
    console.error("Document ask error:", err.message);
    if (err.message === "SESSION_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Document session expired or not found. Please upload your document again.",
      });
    }
    res.json({
      success: true,
      response: "I'm having trouble processing your request right now. Please try again in a moment.",
    });
  }
});

export default router;
