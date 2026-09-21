import "./App.css";
import Kirby from "./components/Kirby";
import ChatPanel from "./components/chat/ChatPanel";
import CodeModal from "./components/modals/CodeModal";
import DiagramModal from "./components/modals/DiagramModal";
import SectionModal from "./components/modals/SectionModal";
import FooterNote from "./components/layout/FooterNote";
import Hero from "./components/layout/Hero";
import IntroStrip from "./components/layout/IntroStrip";
import Topbar from "./components/layout/Topbar";
import InfoCard from "./components/sections/InfoCard";
import { sections } from "./data/sections";
import { useChat } from "./hooks/useChat";
import { useKirbyInteractions } from "./hooks/useKirbyInteractions";
import { useModal } from "./hooks/useModal";

function App() {
  const {
    targetPos,
    revealedSections,
    isChatOpen,
    isChatPending,
    handleSectionClick,
    handleReachTarget,
    handleChatArrive,
    handleWakeUp,
    onToggleChat,
  } = useKirbyInteractions();
  const { activeModal, openCode, openDiagram, openSection, close } = useModal();
  const { input, setInput, messages, isLoading, submit } = useChat();

  const codeSection = sections.find((section) => section.id === "codigo");

  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <Topbar />

      <main id="top">
        <Hero />
        <IntroStrip />

        <section className="content-grid">
          {sections.map((section) => (
            <InfoCard
              key={section.id}
              section={section}
              isRevealed={Boolean(revealedSections[section.id])}
              onReveal={handleSectionClick}
              onOpenSection={openSection}
              onOpenCode={openCode}
              onOpenDiagram={openDiagram}
            />
          ))}
        </section>

        <FooterNote />
      </main>

      <Kirby
        targetPos={targetPos}
        onReachTarget={handleReachTarget}
        onChatArrive={handleChatArrive}
        onWakeUp={handleWakeUp}
        chatOpen={isChatOpen}
        chatPending={isChatPending}
        onToggleChat={onToggleChat}
      />
      {isChatOpen && (
        <ChatPanel
          messages={messages}
          input={input}
          onInputChange={(event) => setInput(event.target.value)}
          onSubmit={submit}
          isLoading={isLoading}
        />
      )}
      {activeModal?.type === "code" && <CodeModal code={codeSection.code} onClose={close} />}
      {activeModal?.type === "diagram" && <DiagramModal onClose={close} />}
      {activeModal?.type === "section" && <SectionModal section={activeModal.section} onClose={close} />}
    </div>
  );
}

export default App;
