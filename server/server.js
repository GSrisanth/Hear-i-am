import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Here I Am search server is running.",
  });
});

app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const cleanQuery = query.trim();

    console.log(`🔎 Searching for: ${cleanQuery}`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are the web search assistant inside an application called "Here I Am".

Search the web for the user's query and provide a concise, useful answer based on current web information.

User query:
${cleanQuery}

Instructions:
- Use current web information.
- Answer the user's query directly.
- Do not invent facts.
- Keep the answer easy to read.
- If the query asks for recent information, prioritize recent sources.
`,
      config: {
        tools: [
          {
            googleSearch: {},
          },
        ],
      },
    });

    const answer = response.text || "";

    const groundingMetadata =
      response.candidates?.[0]?.groundingMetadata;

    const groundingChunks =
      groundingMetadata?.groundingChunks || [];

    const sources = [];

    for (const chunk of groundingChunks) {
      const web = chunk?.web;

      if (!web?.uri) {
        continue;
      }

      const exists = sources.some(
        (source) => source.url === web.uri
      );

      if (!exists) {
        sources.push({
          title: web.title || "Web Source",
          url: web.uri,
        });
      }
    }

    res.json({
      success: true,
      query: cleanQuery,
      answer,
      sources: sources.slice(0, 10),
    });
  } catch (error) {
    console.error("❌ Search error:", error);

    res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Something went wrong while searching the web.",
    });
  }
});

app.listen(PORT, () => {
  console.log("");
  console.log("🚀 Here I Am Search Server");
  console.log(`📡 Running at http://localhost:${PORT}`);
  console.log("");
});