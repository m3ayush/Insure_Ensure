import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import {
  findInsurer,
  calculateScore,
  INSURER_REQUIREMENTS,
} from "../data/insurerRequirements.js";

const GENERATION_MODEL = "gemini-2.5-flash";
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

let ai = null;

// In-memory session store: sessionId -> { firebase_uid, extractedData, insurerKey, uploadedDocIds, createdAt }
const sessions = new Map();

// Clean up expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.createdAt > SESSION_TTL_MS) sessions.delete(id);
  }
}, 10 * 60_000);

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
      console.log(
        `[REIMB] Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`
      );
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

const EXTRACTION_PROMPT = `You are an insurance document analyzer. Extract the following fields from this hospital/insurance document.

Return ONLY valid JSON with these exact keys:
{
  "insurer_name": "Name of the insurance company (e.g. Star Health, HDFC Ergo, ICICI Lombard, Niva Bupa, Care Health, United India Insurance) or null if not found",
  "policy_number": "Policy or claim number or null if not found",
  "hospital_name": "Name of the hospital or null if not found",
  "discharge_date": "Date of discharge in DD/MM/YYYY format or null if not found",
  "bill_amount": 0,
  "patient_name": "Patient name or null if not found",
  "diagnosis": "Primary diagnosis or procedure or null if not found",
  "has_hospital_seal": false,
  "has_doctor_signature": false
}

RULES:
1. bill_amount must be a number (no commas, no currency symbols). Use 0 if not found.
2. has_hospital_seal: true if you can see any official stamp, seal, or hospital emblem on the document.
3. has_doctor_signature: true if you can see any handwritten signature from a doctor.
4. Return ONLY the JSON object, no markdown, no explanation.`;

export async function extractDischargeSummary(fileBuffer, mimeType, fileName) {
  const genai = getAI();
  const startTime = Date.now();

  console.log(
    `[REIMB] Extracting document: ${fileName} (${mimeType}, ${fileBuffer.length} bytes)`
  );

  const result = await withRetry(() =>
    genai.models.generateContent({
      model: GENERATION_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: fileBuffer.toString("base64") } },
            { text: EXTRACTION_PROMPT },
          ],
        },
      ],
      config: {
        temperature: 0.1,
        maxOutputTokens: 1024,
      },
    })
  );

  const rawText = result.text || "";
  console.log(`[REIMB] Raw extraction (${Date.now() - startTime}ms):`, rawText.slice(0, 200));

  // Parse JSON from response (strip markdown fences if present)
  let extractedData;
  try {
    const jsonStr = rawText.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    extractedData = JSON.parse(jsonStr);
  } catch {
    console.error("[REIMB] Failed to parse extraction JSON:", rawText.slice(0, 300));
    throw new Error("Could not extract structured data from this document. Please try a clearer image.");
  }

  // Normalize bill_amount
  if (typeof extractedData.bill_amount === "string") {
    extractedData.bill_amount = parseFloat(extractedData.bill_amount.replace(/[^0-9.]/g, "")) || 0;
  }

  // Match insurer
  const insurerMatch = findInsurer(extractedData.insurer_name);
  if (insurerMatch) {
    extractedData.insurer_key = insurerMatch.key;
  }

  // Create session
  const sessionId = crypto.randomUUID();
  const uploadedDocIds = ["discharge_summary"]; // primary doc counts

  const insurer = insurerMatch || null;
  const insurerKey = insurer?.key || null;

  let scoreResult = { score: 0, breakdown: {}, missing: [] };
  if (insurerKey) {
    scoreResult = calculateScore(insurerKey, uploadedDocIds, extractedData);
  }

  sessions.set(sessionId, {
    firebase_uid: null,
    extractedData,
    insurerKey,
    uploadedDocIds: [...uploadedDocIds],
    createdAt: Date.now(),
  });

  console.log(`[REIMB] Session created: ${sessionId} (${Date.now() - startTime}ms)`);

  return {
    sessionId,
    extractedData,
    insurer: insurer
      ? { key: insurer.key, display_name: insurer.display_name, mandatory_docs: insurer.mandatory_docs }
      : null,
    score: scoreResult.score,
    scoreBreakdown: scoreResult.breakdown,
    missing: scoreResult.missing,
    responseTimeMs: Date.now() - startTime,
  };
}

export function setSessionUid(sessionId, firebase_uid) {
  const session = sessions.get(sessionId);
  if (session) session.firebase_uid = firebase_uid;
}

export function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

export function selectInsurer(sessionId, insurerKey) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const insurer = INSURER_REQUIREMENTS[insurerKey];
  if (!insurer) return null;

  session.insurerKey = insurerKey;
  const scoreResult = calculateScore(insurerKey, session.uploadedDocIds, session.extractedData);

  return {
    insurer: { key: insurerKey, display_name: insurer.display_name, mandatory_docs: insurer.mandatory_docs },
    score: scoreResult.score,
    scoreBreakdown: scoreResult.breakdown,
    missing: scoreResult.missing,
  };
}

export function addDocument(sessionId, docId, fileName) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (!session.insurerKey) return null;

  if (!session.uploadedDocIds.includes(docId)) {
    session.uploadedDocIds.push(docId);
  }

  const scoreResult = calculateScore(
    session.insurerKey,
    session.uploadedDocIds,
    session.extractedData
  );

  return {
    uploadedDocIds: [...session.uploadedDocIds],
    score: scoreResult.score,
    scoreBreakdown: scoreResult.breakdown,
    missing: scoreResult.missing,
  };
}

export function getAvailableInsurers() {
  return Object.entries(INSURER_REQUIREMENTS).map(([key, ins]) => ({
    key,
    display_name: ins.display_name,
  }));
}
