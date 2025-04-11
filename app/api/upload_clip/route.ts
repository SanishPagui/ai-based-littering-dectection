// pages/api/upload_clip.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const convexFunctionUrl = "https://hip-wolverine-698.convex.cloud/functions/clips:uploadClip";
    const convexResponse = await fetch(convexFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Optional: Add an admin auth token here if needed
      },
      body: JSON.stringify({ url }),
    });

    const result = await convexResponse.json();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Upload failed:", e);
    return res.status(500).json({ error: "Server error" });
  }
}
