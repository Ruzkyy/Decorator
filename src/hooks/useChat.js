// Controlador: estado y lógica del chat.
import { useState } from "react";
import { sendChatMessage } from "../services/chatService";

export function useChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "¡Hola! Pregúntame sobre el patrón Decorator." },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setIsLoading(true);
    try {
      const reply = await sendChatMessage(question);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (error) {
      setMessages((m) => [...m, { role: "assistant", text: `No pude responder: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { input, setInput, messages, isLoading, submit };
}
