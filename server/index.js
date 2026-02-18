import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import recommendationRoutes from "./routes/recommendation.js";
import chatbotRoutes from "./routes/chatbot.js";
import documentChatRoutes from "./routes/documentChat.js";
import reimbursementRoutes from "./routes/reimbursement.js";
import { initializeRAG } from "./services/ragService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

connectDB();

// Initialize RAG service (non-blocking — server starts immediately)
initializeRAG().catch((err) =>
  console.error("RAG initialization failed:", err.message)
);

app.use("/api/recommendations", recommendationRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/document-chat", documentChatRoutes);
app.use("/api/reimbursement", reimbursementRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
