import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

const GENERATION_MODEL = "gemini-2.5-flash";
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

let ai = null;

// In-memory session store: sessionId -> { firebase_uid, extractedText, fileName, uploadedAt }
const sessions = new Map();

// Clean up expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.uploadedAt > SESSION_TTL_MS) sessions.delete(id);
  }
}, 10 * 60_000);

const FALLBACK_RESPONSE =
  "I'm having trouble processing your request right now. Please try again in a moment.";

const DOCUMENT_QA_PROMPT = `You are InsureBot Document Analyzer for InsureEnsure.

RULES YOU MUST FOLLOW:
1. ONLY answer questions using the DOCUMENT CONTENT provided below. Do not use outside knowledge.
2. If the answer is NOT in the document, say "I cannot find that information in the uploaded document."
3. Be precise with numbers, dates, policy numbers, amounts, and policy details.
4. Keep responses concise (2-4 paragraphs max) and well-formatted.
5. Use bullet points for lists and line breaks between paragraphs.
6. NEVER fabricate or guess information not present in the document.
7. If asked about topics unrelated to the document, politely redirect to document-related questions.
8. Always maintain a helpful, neutral, educational tone.`;

// ── Helpers ──────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit = err.status === 429 || err.message?.includes("429");
      if (!isRateLimit || attempt === maxRetries) throw err;
      const delay = Math.min(2000 * 2 ** attempt, 30000);
      console.log(`[DOC] Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(delay);
    }
  }
}

function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

// ── Public API ───────────────────────────────────────────────

export function isSessionValid(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return false;
  if (Date.now() - session.uploadedAt > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return false;
  }
  return true;
}

export async function extractDocument(fileBuffer, mimeType, fileName) {
  const genai = getAI();
  const startTime = Date.now();

  console.log(`[DOC] Extracting document: ${fileName} (${mimeType}, ${fileBuffer.length} bytes)`);

  // Step 1: Extract text from document using Gemini vision
  const extractResult = await withRetry(() =>
    genai.models.generateContent({
      model: GENERATION_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: fileBuffer.toString("base64") } },
            {
              text: "Extract ALL text and information from this insurance document. Preserve the structure, headings, tables, amounts, dates, policy numbers, names, terms, conditions, and every detail. Output the complete extracted content in a well-organized format.",
            },
          ],
        },
      ],
      config: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    })
  );

  const extractedText = extractResult.text;
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error("Could not extract text from this document. Please try a clearer image or PDF.");
  }

  console.log(`[DOC] Extracted ${extractedText.length} chars from ${fileName}`);

  // Step 2: Generate suggested questions
  const suggestResult = await withRetry(() =>
    genai.models.generateContent({
      model: GENERATION_MODEL,
      contents: `Based on this insurance document content, generate exactly 3 short, specific questions a user might ask about it. Return ONLY the 3 questions, one per line, no numbering or bullets.\n\nDocument content:\n${extractedText.slice(0, 3000)}`,
      config: {
        temperature: 0.5,
        maxOutputTokens: 256,
      },
    })
  );

  const suggestedQuestions = (suggestResult.text || "")
    .split("\n")
    .map((q) => q.trim())
    .filter((q) => q.length > 5 && q.length < 200)
    .slice(0, 3);

  // Step 3: Store session
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, {
    firebase_uid: null, // set by route
    extractedText,
    fileName,
    uploadedAt: Date.now(),
  });

  console.log(`[DOC] Session created: ${sessionId} (${Date.now() - startTime}ms)`);

  return {
    sessionId,
    documentSummary: extractedText.slice(0, 300) + (extractedText.length > 300 ? "..." : ""),
    suggestedQuestions,
    responseTimeMs: Date.now() - startTime,
  };
}

export async function answerDocumentQuestion(sessionId, message, conversationHistory) {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  if (Date.now() - session.uploadedAt > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    throw new Error("SESSION_NOT_FOUND");
  }

  const genai = getAI();
  const startTime = Date.now();

  const historyText = conversationHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const userPrompt = `DOCUMENT CONTENT:\n${session.extractedText}\n\n${
    historyText ? `CONVERSATION HISTORY:\n${historyText}\n\n` : ""
  }USER QUESTION: ${message}`;

  try {
    console.log("[DOC] Answering question:", message.slice(0, 60));
    const result = await withRetry(() =>
      genai.models.generateContent({
        model: GENERATION_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction: DOCUMENT_QA_PROMPT,
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      })
    );
    console.log("[DOC] Response length:", result.text?.length ?? "null");

    return {
      response: result.text || FALLBACK_RESPONSE,
      responseTimeMs: Date.now() - startTime,
    };
  } catch (err) {
    console.error("[DOC] Generation error:", err.message);
    return {
      response: FALLBACK_RESPONSE,
      responseTimeMs: Date.now() - startTime,
      error: err.message,
    };
  }
}

export function setSessionUid(sessionId, firebase_uid) {
  const session = sessions.get(sessionId);
  if (session) session.firebase_uid = firebase_uid;
}
