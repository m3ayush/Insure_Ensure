import { GoogleGenAI } from "@google/genai";
import { KNOWLEDGE_BASE } from "../data/knowledgeBase.js";

const EMBEDDING_MODEL = "text-embedding-004";
const GENERATION_MODEL = "gemini-2.5-flash";
const SIMILARITY_THRESHOLD = 0.25;
const TOP_K = 5;

let ai = null;
let chunkEmbeddings = []; // [{chunk, vector}]
let ragReady = false;

const FALLBACK_RESPONSE =
  "I'm having trouble processing your request right now. Please try again in a moment. If the issue persists, you can explore our Recommendation tool for personalized insurance suggestions.";

const INSUFFICIENT_INFO_RESPONSE =
  "I don't have enough information in my knowledge base to answer that question accurately. Please try asking about insurance topics like policy types, terminology, claims, or coverage. For specific advice, consult a licensed insurance advisor.";

const SYSTEM_PROMPT = `You are InsureBot, an educational insurance assistant for InsureEnsure.

RULES YOU MUST FOLLOW:
1. ONLY answer questions about insurance using the CONTEXT provided below. Do not use outside knowledge.
2. If the context does not contain enough information to answer, say "I don't have enough information on that topic. Please consult a licensed insurance advisor."
3. NEVER recommend specific insurance products or tell users to buy a specific policy.
4. NEVER provide legal, medical, or tax advice. For tax questions, refer users to a CA/tax professional.
5. NEVER make guarantees about claim settlements, returns, or policy outcomes.
6. Keep responses concise (2-4 paragraphs max) and easy to understand.
7. Use Indian insurance context (INR, IRDAI, Indian regulations) when relevant.
8. If asked about topics unrelated to insurance, politely decline and redirect to insurance topics.
9. Always maintain a helpful, neutral, educational tone.
10. Format responses with line breaks between paragraphs for readability. Use bullet points for lists.`;

// ── Helpers ──────────────────────────────────────────────────

function l2Normalize(vector) {
  let norm = 0;
  for (let i = 0; i < vector.length; i++) norm += vector[i] * vector[i];
  norm = Math.sqrt(norm);
  if (norm === 0) return vector;
  return vector.map((v) => v / norm);
}

function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

// ── Embedding ────────────────────────────────────────────────

async function embedTexts(texts) {
  const vectors = [];
  const batchSize = 20;

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((text) =>
        ai.models.embedContent({
          model: EMBEDDING_MODEL,
          contents: text,
        })
      )
    );
    for (const result of results) {
      const raw = result.embeddings[0].values;
      vectors.push(l2Normalize(raw));
    }
  }

  return vectors;
}

async function embedSingle(text) {
  const result = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
  });
  return l2Normalize(result.embeddings[0].values);
}

// ── Public API ───────────────────────────────────────────────

export function isRAGReady() {
  return ragReady;
}

export async function initializeRAG() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not set — chatbot will not work");
    return;
  }

  ai = new GoogleGenAI({ apiKey });

  console.log(`Embedding ${KNOWLEDGE_BASE.length} knowledge base chunks...`);
  const start = Date.now();

  const texts = KNOWLEDGE_BASE.map((c) => `${c.topic}: ${c.content}`);
  const vectors = await embedTexts(texts);

  chunkEmbeddings = KNOWLEDGE_BASE.map((chunk, i) => ({
    chunk,
    vector: vectors[i],
  }));

  ragReady = true;
  console.log(
    `RAG service initialized: ${chunkEmbeddings.length} chunks embedded in ${Date.now() - start}ms`
  );
}

export function retrieveContext(queryVector) {
  const scored = chunkEmbeddings.map(({ chunk, vector }) => ({
    chunk,
    score: dotProduct(queryVector, vector),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, TOP_K);
}

export async function handleChatQuery(message, conversationHistory) {
  if (!ragReady) {
    return {
      response: "The chatbot service is still starting up. Please try again in a moment.",
      sources: [],
      belowThreshold: false,
    };
  }

  const startTime = Date.now();

  // 1. Embed the query
  const queryVector = await embedSingle(message);

  // 2. Retrieve relevant chunks
  const retrieved = retrieveContext(queryVector);

  // 3. Similarity threshold gate
  if (retrieved.length === 0 || retrieved[0].score < SIMILARITY_THRESHOLD) {
    return {
      response: INSUFFICIENT_INFO_RESPONSE,
      sources: retrieved.slice(0, 3).map((r) => ({
        id: r.chunk.id,
        topic: r.chunk.topic,
        category: r.chunk.category,
        score: Math.round(r.score * 1000) / 1000,
      })),
      belowThreshold: true,
      responseTimeMs: Date.now() - startTime,
    };
  }

  // 4. Build context from retrieved chunks
  const contextText = retrieved
    .map((r, i) => `[${i + 1}] ${r.chunk.topic}:\n${r.chunk.content}`)
    .join("\n\n");

  // 5. Build conversation history string
  const historyText = conversationHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  // 6. Build full prompt
  const userPrompt = `CONTEXT FROM KNOWLEDGE BASE:\n${contextText}\n\n${
    historyText ? `CONVERSATION HISTORY:\n${historyText}\n\n` : ""
  }USER QUESTION: ${message}`;

  // 7. Generate response
  try {
    const result = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    });

    const response = result.text || FALLBACK_RESPONSE;
    const sources = retrieved.map((r) => ({
      id: r.chunk.id,
      topic: r.chunk.topic,
      category: r.chunk.category,
      score: Math.round(r.score * 1000) / 1000,
    }));

    return {
      response,
      sources,
      belowThreshold: false,
      responseTimeMs: Date.now() - startTime,
    };
  } catch (err) {
    console.error("Gemini generation error:", err.message);
    return {
      response: FALLBACK_RESPONSE,
      sources: [],
      belowThreshold: false,
      responseTimeMs: Date.now() - startTime,
      error: err.message,
    };
  }
}
