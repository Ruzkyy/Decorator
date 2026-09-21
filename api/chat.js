const model = "gemini-3.6-flash";
const systemInstruction = "Responde únicamente preguntas sobre el patrón de diseño Decorator, sus conceptos, estructura, implementación, ventajas, desventajas y relación con otros patrones estructurales. Si preguntan por cualquier otro tema, responde exactamente: Solo puedo responder preguntas sobre el patrón Decorator.";

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
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: message.trim() }] }],
        }),
      },
    );
    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      throw new Error(data.error?.message || "Gemini rechazó la solicitud.");
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("Gemini no devolvió texto.");

    response.status(200).json({ reply });
  } catch (error) {
    response.status(502).json({ error: error.message });
  }
}
