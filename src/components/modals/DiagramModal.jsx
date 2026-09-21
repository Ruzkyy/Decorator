// Vista: modal del diagrama ampliado.
import Modal from "./Modal";
import diagramaClases from "../../assets/diagrama-clases.png.png";

export default function DiagramModal({ onClose }) {
  return (
    <Modal
      kicker="CASO PRÁCTICO · UML"
      title="Diagrama de clases"
      titleId="diagrama-ampliado"
      closeLabel="Cerrar diagrama"
      className="diagram-modal"
      onClose={onClose}
    >
      <img
        className="expanded-diagram"
        src={diagramaClases}
        alt="Diagrama UML ampliado del patrón Decorator"
      />
    </Modal>
  );
}
