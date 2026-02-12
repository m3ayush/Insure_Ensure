import { Router } from "express";
import { isRAGReady, handleChatQuery } from "../services/ragService.js";
import { chatRateLimiter } from "../middleware/rateLimiter.js";
import ChatMessage from "../models/ChatMessage.js";

const router = Router();

// Validate and sanitize the request
function validateChatRequest(req, res, next) {
  const { firebase_uid, message, conversationHistory } = req.body;

  if (!firebase_uid || typeof firebase_uid !== "string") {
    return res.status(400).json({ success: false, message: "firebase_uid is required" });
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

router.post("/", validateChatRequest, chatRateLimiter, async (req, res) => {
  const { firebase_uid, message, conversationHistory } = req.body;

  if (!isRAGReady()) {
    return res.status(503).json({
      success: false,
      message: "The chatbot service is still starting up. Please try again in a moment.",
    });
  }

  try {
    const result = await handleChatQuery(message, conversationHistory);

    // Log to MongoDB (don't let logging failure block the response)
    ChatMessage.create({
      firebase_uid,
      query: message,
      response: result.response,
      retrieved_chunks: result.sources.map((s) => ({
        chunk_id: s.id,
        score: s.score,
      })),
      response_time_ms: result.responseTimeMs,
      error: result.error || null,
    }).catch((err) => console.error("Chat log error:", err.message));

    res.json({
      success: true,
      response: result.response,
      sources: result.sources,
    });
  } catch (err) {
    console.error("Chat endpoint error:", err.message);
    res.json({
      success: true,
      response:
        "I'm having trouble processing your request right now. Please try again in a moment.",
      sources: [],
    });
  }
});

router.get("/health", (req, res) => {
  res.json({
    ready: isRAGReady(),
    chunks: isRAGReady() ? "loaded" : "pending",
  });
});

export default router;
