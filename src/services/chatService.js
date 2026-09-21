// Modelo: servicio para enviar mensajes al backend de chat.
export async function sendChatMessage(message) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { error: `El servidor respondió con ${response.status} y no con JSON.` };
  if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");
  return data.reply;
}
