import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'
import { askGemini } from './server/gemini.js'

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

      const apiKey = process.env.GEMINI_API_KEY?.trim();
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
        const reply = await askGemini(body.message, apiKey);
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.end(JSON.stringify({ reply }));
      } catch (error) {
        response.statusCode = 502;
        response.setHeader("Content-Type", "application/json; charset=utf-8");
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
