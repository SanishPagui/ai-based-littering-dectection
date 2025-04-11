// pages/api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure GOOGLE_API_KEY is in your .env.local
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
}
