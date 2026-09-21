// Vista: panel de chat de Kirby.
export default function ChatPanel({ messages, input, onInputChange, onSubmit, isLoading }) {
  return (
    <aside className="kirby-chat" aria-label="Chat sobre el patrón Decorator">
      <div className="kirby-chat-header">
        <div>
          <span className="modal-kicker">KIRBY RESPONDE</span>
          <h2>Pregúntame sobre Decorator</h2>
        </div>
        <span className="chat-status">● EN LÍNEA</span>
      </div>
      <div className="kirby-chat-messages" aria-live="polite">
        {messages.map((message, index) => (
          <p className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            {message.text}
          </p>
        ))}
        {isLoading && <p className="chat-message assistant">Pensando...</p>}
      </div>
      <form className="kirby-chat-form" onSubmit={onSubmit}>
        <input
          value={input}
          onChange={onInputChange}
          placeholder="Escribe una pregunta..."
          aria-label="Pregunta para Kirby"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>Enviar</button>
      </form>
      <p className="chat-hint">Doble clic en Kirby para cerrar</p>
    </aside>
  );
}
