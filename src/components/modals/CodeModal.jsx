// Vista: modal de código ampliado.
import Modal from "./Modal";

export default function CodeModal({ code, onClose }) {
  return (
    <Modal
      kicker="CASO PRÁCTICO · JAVA"
      title="Código ampliado"
      titleId="codigo-ampliado"
      closeLabel="Cerrar código"
      onClose={onClose}
    >
      <pre className="code-modal-content"><code>{code.join("\n")}</code></pre>
    </Modal>
  );
}
