import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY not found in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
  console.log("Listing available models...");
  try {
    const response = await ai.models.list();
    // The response structure might vary slightly, so I'll log the raw output or map it
    // Based on @google/genai docs, response.models is the array
    if (response) {
       console.log("Models found:", response);

       // Try to find embedding models specifically
       const embeddingModels = response.filter(m => m.name.includes("embedding"));
         if (embeddingModels.length > 0) {
              console.log("Embedding models:", embeddingModels.map(m => m.name));
         } else {
             console.log("No embedding models found in list.");
         }
    } else {
        console.log("Response format unexpected:", response);
    }

  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

async function testEmbedding(modelName) {
  console.log(`\nTesting embedding with model: ${modelName}`);
  try {
    const result = await ai.models.embedContent({
      model: modelName,
      contents: "Hello world",
    });
    console.log("Success! Embedding generated.");
  } catch (error) {
    console.error(`Failed to embed with ${modelName}:`, error.message);
  }
}

async function run() {
  await listModels();
  await testEmbedding("text-embedding-004");
  await testEmbedding("models/text-embedding-004");
  await testEmbedding("embedding-001");
}

run();
