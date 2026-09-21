import { askGemini } from "../server/gemini.js";

export default async function handler(request, response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "POST") {
    response.status(405).json({ error: "Método no permitido." });
    return;
  }

  const message = request.body?.message;
  if (typeof message !== "string" || !message.trim()) {
    response.status(400).json({ error: "Escribe una pregunta antes de enviar." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    response.status(500).json({ error: "Falta configurar GEMINI_API_KEY en Vercel." });
    return;
  }

  try {
    const reply = await askGemini(message, apiKey);
    response.status(200).json({ reply });
  } catch (error) {
    response.status(502).json({ error: error.message });
  }
}
