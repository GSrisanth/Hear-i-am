import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  try {
    const { query } = req.body || {};

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const cleanQuery = query.trim();

    console.log(`Searching for: ${cleanQuery}`);

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

    return res.status(200).json({
      success: true,
      query: cleanQuery,
      answer,
      sources: sources.slice(0, 10),
    });
  } catch (error) {
    console.error("Gemini search error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Something went wrong while searching the web.",
    });
  }
}