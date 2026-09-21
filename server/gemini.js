// Modelo: cliente para la API de Gemini.
const MODEL = "gemini-3.6-flash";
const SYSTEM_INSTRUCTION = "Responde únicamente preguntas sobre el patrón de diseño Decorator, sus conceptos, estructura, implementación, ventajas, desventajas y relación con otros patrones estructurales. Si preguntan por cualquier otro tema, responde exactamente: Solo puedo responder preguntas sobre el patrón Decorator.";

export { MODEL, SYSTEM_INSTRUCTION };

export async function askGemini(message, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: message.trim() }] }],
      }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini rechazó la solicitud.");
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) throw new Error("Gemini no devolvió texto.");
  return reply;
}
