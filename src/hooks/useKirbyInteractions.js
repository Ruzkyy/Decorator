// Controlador: estado global de Kirby y sus interacciones con las tarjetas y el chat.
import { useState } from "react";

export function useKirbyInteractions() {
  const [targetPos, setTargetPos] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [revealedSections, setRevealedSections] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatPending, setIsChatPending] = useState(false);

  const handleSectionClick = (event, id) => {
    if (revealedSections[id]) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTargetPos({
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.bottom - window.innerHeight + 24,
    });
    setActiveSection(id);
  };

  const handleReachTarget = () => {
    if (!activeSection) return;
    setRevealedSections((current) => ({ ...current, [activeSection]: true }));
    setActiveSection(null);
    setTargetPos(null);
  };

  const handleKirbyDoubleClick = () => {
    if (isChatOpen || isChatPending) return;
    setTargetPos({
      x: window.innerWidth / 2 - 120,
      y: 0,
    });
    setIsChatPending(true);
  };

  const handleChatArrive = () => {
    setIsChatPending(false);
    setIsChatOpen(true);
  };

  const handleChatToggle = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
      setTargetPos(null);
    }
  };

  const handleWakeUp = () => {
    setTargetPos(null);
  };

  return {
    targetPos,
    activeSection,
    revealedSections,
    isChatOpen,
    isChatPending,
    setTargetPos,
    setActiveSection,
    setRevealedSections,
    setIsChatOpen,
    setIsChatPending,
    handleSectionClick,
    handleReachTarget,
    handleKirbyDoubleClick,
    handleChatArrive,
    handleChatToggle,
    handleWakeUp,
    onToggleChat: isChatOpen ? handleChatToggle : handleKirbyDoubleClick,
  };
}
