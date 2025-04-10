import { api } from "@/convex/_generated/api";
import { convexClient } from "@/lib/convex";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { image, timestamp } = req.body;

  const saved = await convexClient.mutation(api.SaveDroppedImage, {
    image,
    timestamp,
  });

  res.status(200).json({ status: "success", saved });
}
