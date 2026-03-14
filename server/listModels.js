// Run this from your server/ directory:
// node listModels.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
);
const data = await response.json();

console.log("\n✅ Available models that support generateContent:\n");
data.models
  ?.filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
  .forEach((m) => console.log(" -", m.name));