// /api/chat.js — backend z CORS + GPT-3.5
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: true
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // 🔴 Nagłówki CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔁 Obsługa preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });

    res.status(200).json(completion);
  } catch (err) {
    console.error("Błąd GPT:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
