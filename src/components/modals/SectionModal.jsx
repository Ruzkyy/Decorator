// Vista: modal para ampliar una sección con contenido textual o de patrones.
import Modal from "./Modal";
import SectionContent from "../sections/SectionContent";

export default function SectionModal({ section, onClose }) {
  return (
    <Modal
      kicker={section.eyebrow}
      title={section.title}
      titleId="seccion-ampliada"
      closeLabel="Cerrar sección"
      className="section-modal"
      onClose={onClose}
    >
      <div className="expanded-section-content">
        <SectionContent section={section} />
      </div>
    </Modal>
  );
}
