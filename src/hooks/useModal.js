// Controlador: estado compartido para los modales principales.
import { useState } from "react";

export function useModal() {
  const [activeModal, setActiveModal] = useState(null);

  const openCode = () => setActiveModal({ type: "code" });
  const openDiagram = () => setActiveModal({ type: "diagram" });
  const openSection = (section) => setActiveModal({ type: "section", section });
  const close = () => setActiveModal(null);

  return { activeModal, openCode, openDiagram, openSection, close };
}
