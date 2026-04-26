import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { verifyAuth } from "./middleware/verifyAuth.js";
import authRoutes from "./routes/auth.js";
import recommendationRoutes from "./routes/recommendation.js";
import chatbotRoutes from "./routes/chatbot.js";
import documentChatRoutes from "./routes/documentChat.js";
import reimbursementRoutes from "./routes/reimbursement.js";
import { initializeRAG } from "./services/ragService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

connectDB();

initializeRAG().catch((err) =>
  console.error("RAG initialization failed:", err.message)
);

// Public auth routes (no session cookie required)
app.use("/api/auth", authRoutes);

// All routes below require a valid session cookie
app.use("/api/recommendations", verifyAuth, recommendationRoutes);
app.use("/api/chatbot", verifyAuth, chatbotRoutes);
app.use("/api/document-chat", verifyAuth, documentChatRoutes);
app.use("/api/reimbursement", verifyAuth, reimbursementRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
