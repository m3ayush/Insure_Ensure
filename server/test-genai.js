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
    console.log("Response type:", typeof response);

    // The new SDK returns an iterable response for list()
    const models = [];
    for await (const model of response) {
      models.push(model);
    }

    console.log(`Found ${models.length} models.`);

    const embeddingModels = models.filter(m => m.name.includes("embedding"));
    if (embeddingModels.length > 0) {
      console.log("Embedding models:", embeddingModels.map(m => m.name));
    } else {
      console.log("No embedding models found.");
      console.log("All models:", models.map(m => m.name));
    }

  } catch (error) {
    console.error("Error listing models:", error);
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
    console.log("Embedding length:", result.embeddings[0].values.length);
  } catch (error) {
    console.error(`Failed to embed with ${modelName}:`, error.message);
  }
}

async function run() {
  await listModels();
  // We will try to test whatever embedding models we find, plus the usual suspects
  // But let's just stick to the specific ones for now
  await testEmbedding("models/gemini-embedding-001");
}

run();
