import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'

const geminiApi = () => ({
  name: "gemini-chat-api",
  configureServer(server) {
    server.middlewares.use("/api/chat", async (request, response) => {
      if (request.method !== "POST") {
        response.statusCode = 405;
        response.end(JSON.stringify({ error: "Método no permitido." }));
        return;
      }

      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      let body;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        response.statusCode = 400;
        response.end(JSON.stringify({ error: "La solicitud no es JSON válido." }));
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        response.statusCode = 500;
        response.end(JSON.stringify({ error: "Falta configurar GEMINI_API_KEY en el entorno." }));
        return;
      }

      if (typeof body.message !== "string" || !body.message.trim()) {
        response.statusCode = 400;
        response.end(JSON.stringify({ error: "Escribe una pregunta antes de enviar." }));
        return;
      }

      try {
        const geminiResponse = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{
                  text: "Responde únicamente preguntas sobre el patrón de diseño Decorator, sus conceptos, estructura, implementación, ventajas, desventajas y relación con otros patrones estructurales. Si preguntan por cualquier otro tema, responde exactamente: Solo puedo responder preguntas sobre el patrón Decorator.",
                }],
              },
              contents: [{ role: "user", parts: [{ text: body.message.trim() }] }],
            }),
          },
        );
        const data = await geminiResponse.json();
        if (!geminiResponse.ok) {
          throw new Error(data.error?.message || "Gemini rechazó la solicitud.");
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) throw new Error("Gemini no devolvió texto.");
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ reply }));
      } catch (error) {
        response.statusCode = 502;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: error.message }));
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = {
    ...loadEnv(mode, process.cwd(), ""),
    ...loadEnv(mode, path.resolve(process.cwd(), "src"), ""),
  };
  process.env.GEMINI_API_KEY = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  return {
    plugins: [react(), geminiApi()],
  };
})
