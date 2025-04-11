import { GoogleGenerativeAI } from "@google/generative-ai";

// pages/api/gemini.js

// Make sure GOOGLE_API_KEY is in your .env.local
const googleApiKey = process.env.GOOGLE_API_KEY;

if (!googleApiKey) {
  throw new Error("Google API key is not defined.");
}

const genAI = new GoogleGenerativeAI(googleApiKey);

export default async function handler(req: any, res:any) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST allowed" });
    }

    const { prompt, model } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    if (!model) {
        return res.status(400).json({ error: "Model is required" });
    }

    try {
        const generativeModel = genAI.getGenerativeModel({ model });

        const result = await generativeModel.generateContent(prompt);
        const text = result.response.text();

        res.status(200).json({ text });
    } catch (error) {
        console.error("Gemini API Error:", (error as any).message);
        res.status(500).json({ error: "Something went wrong" });
    }
}
