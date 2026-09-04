import { useState } from "react";
import Kirby from "./components/Kirby";
import diagramaDecoradores from "./assets/diagrama-decoradores.png";
import "./App.css";

const sections = [
  {
    id: "concepto",
    number: "01",
    eyebrow: "Concepto",
    title: "¿Qué es Decorator?",
    content:
      "Decorator es un patrón de diseño estructural que envuelve un objeto para añadirle responsabilidades de forma dinámica, sin modificar su clase original. Su objetivo principal es extender el comportamiento mediante capas combinables, manteniendo la misma interfaz del objeto base.",
  },
  {
    id: "ventajas",
    number: "02",
    eyebrow: "Análisis",
    title: "Ventajas y desventajas",
    content:
      "Ventajas: evita una explosión de subclases, combina comportamientos en tiempo de ejecución y respeta la responsabilidad única. Desventajas: demasiadas capas pueden dificultar la lectura, el orden de los decoradores importa y depurar el objeto final puede requerir seguir toda la cadena.",
  },
  {
    id: "contexto",
    number: "03",
    eyebrow: "Caso práctico · 01",
    title: "Un enemigo, muchas combinaciones",
    content:
      "En un videojuego, un enemigo tiene defensa y velocidad iniciales, pero puede equipar un casco, una armadura y unas botas. Crear una clase para cada combinación produciría demasiadas subclases. Necesitamos sumar atributos sin cambiar la clase Enemigo ni perder la misma interfaz.",
  },
  {
    id: "implementacion",
    number: "04",
    eyebrow: "Caso práctico · 02",
    title: "La solución: envolver al personaje",
    content:
      "La interfaz Personaje define defensa() y velocidad(). Enemigo aporta los valores base. Decorador también implementa Personaje, conserva una referencia al personaje envuelto y delega sus métodos. Casco suma 5 de defensa, Armadura suma 20 y Botas suma 5 de velocidad.",
  },
  {
    id: "codigo",
    number: "05",
    eyebrow: "Caso práctico · 03",
    title: "El ejemplo completo en Java",
    content:
      "Cada objeto añade solo su responsabilidad. Al envolver Enemigo con Casco, Armadura y Botas, las llamadas recorren la cadena y producen defensa 35 y velocidad 15.",
    code: [
      "interface Personaje {",
      "    int defensa();",
      "    int velocidad();",
      "}",
      "",
      "class Enemigo implements Personaje {",
      "    public int defensa() { return 10; }",
      "    public int velocidad() { return 10; }",
      "}",
      "",
      "abstract class Decorador implements Personaje {",
      "    protected Personaje personaje;",
      "",
      "    public Decorador(Personaje personaje) { this.personaje = personaje; }",
      "",
      "    public int defensa() { return personaje.defensa(); }",
      "    public int velocidad() { return personaje.velocidad(); }",
      "}",
      "",
      "class Casco extends Decorador {",
      "    public Casco(Personaje personaje) { super(personaje); }",
      "    public int defensa() { return super.defensa() + 5; }",
      "}",
      "",
      "class Armadura extends Decorador {",
      "    public Armadura(Personaje personaje) { super(personaje); }",
      "    public int defensa() { return super.defensa() + 20; }",
      "}",
      "",
      "class Botas extends Decorador {",
      "    public Botas(Personaje personaje) { super(personaje); }",
      "    public int velocidad() { return super.velocidad() + 5; }",
      "}",
      "",
      "public class Main {",
      "    public static void main(String[] args) {",
      "        Personaje enemigo = new Botas(",
      "            new Armadura(",
      "                new Casco(",
      "                    new Enemigo()",
      "                )",
      "            )",
      "        );",
      "",
      '        System.out.println("Defensa: " + enemigo.defensa());   // 35',
      '        System.out.println("Velocidad: " + enemigo.velocidad()); // 15',
      "    }",
      "}",
    ],
  },
  {
    id: "conclusiones",
    number: "06",
    eyebrow: "Cierre",
    title: "Conclusiones",
    content:
      "Decorator reemplaza combinaciones interminables de herencia por composición flexible. Cuando un objeto necesita agregar o quitar capacidades sin cambiar su identidad, envolverlo con pequeñas capas mantiene el código extensible, claro y preparado para nuevas reglas del juego.",
  },
  {
    id: "compatibilidad",
    number: "07",
    eyebrow: "Familia estructural",
    title: "¿Con qué patrones convive?",
    content:
      "Decorator combina bien con Composite cuando cada nodo puede recibir capas, y con Factory Method o Abstract Factory cuando una fábrica decide qué mejoras colocar. También puede acompañar a Adapter, aunque cumplen objetivos distintos. No existe una incompatibilidad absoluta: con Proxy puede confundirse porque ambos envuelven objetos, y con Flyweight suele ser una mala combinación si las capas guardan estado propio. La elección depende de si queremos añadir responsabilidades, cambiar una interfaz o compartir memoria.",
  },
];

function App() {
  const [targetPos, setTargetPos] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [revealedSections, setRevealedSections] = useState({});
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatPending, setIsChatPending] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "¡Hola! Pregúntame sobre el patrón Decorator." },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

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

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question || isChatLoading) return;

    setChatInput("");
    setChatMessages((messages) => [...messages, { role: "user", text: question }]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");
      setChatMessages((messages) => [...messages, { role: "assistant", text: data.reply }]);
    } catch (error) {
      setChatMessages((messages) => [
        ...messages,
        { role: "assistant", text: `No pude responder: ${error.message}` },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="Laboratorio Decorator, inicio">
          <span className="brand-mark">D/</span>
          <span>LABORATORIO DECORATOR</span>
        </a>
        <div className="nav-links">
          <a href="#lab">El patrón</a>
          <a href="#mapa">Mapa de capas</a>
          <a href="#about">Conclusiones</a>
        </div>
        <span className="edition">ED. 01 — 2026</span>
      </nav>

      <main id="top">
        <section className="hero-layout" id="lab">
          <aside className="hero-rail">
            <span className="rail-label">PATRONES / 04</span>
            <span className="rail-line" />
            <span className="rail-vertical">ESTRUCTURAL</span>
          </aside>
          <div className="hero-copy">
            <p className="kicker"><span className="pulse-dot" /> Guía visual interactiva</p>
            <h1>DECORA<br /><em>AL</em> ENEMIGO</h1>
            <p className="hero-intro">
              Cómo construir personajes con casco, armadura y poderes sin fabricar una clase nueva para cada combinación.
            </p>
            <div className="hero-meta">
              <span>Patrón de diseño estructural</span>
              <span>Desliza / explora / combina</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Diagrama de capas de un enemigo">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="enemy-silhouette">
              <span className="enemy-head">◈</span>
              <span className="enemy-body">▰</span>
              <span className="enemy-label">ENEMIGO BASE</span>
            </div>
            <div className="layer-tag tag-top">+ CASCO</div>
            <div className="layer-tag tag-right">+ ARMADURA</div>
            <div className="layer-tag tag-bottom">+ ESCUDO</div>
            <span className="crosshair crosshair-one">＋</span>
            <span className="crosshair crosshair-two">＋</span>
          </div>
          <div className="hero-index"><strong>01</strong><span>/ 06</span></div>
        </section>

        <section className="intro-strip" id="mapa">
          <span className="section-marker">A — 001</span>
          <p>Un objeto puede ser simple en el centro y complejo en la superficie. Haz clic en cada módulo: Kirby irá a desbloquear la explicación.</p>
          <span className="scroll-note">DESPLÁZATE PARA ABRIR ↓</span>
        </section>

        <section className="content-grid">
          {sections.map((section) => {
            const isRevealed = revealedSections[section.id];
            return (
              <article
                className={`info-card ${isRevealed ? "is-revealed" : ""} ${section.code ? "has-code" : ""} ${section.id === "implementacion" ? "has-diagram" : ""}`}
                key={section.id}
                onClick={(event) => handleSectionClick(event, section.id)}
              >
                <div className="card-topline">
                  <span>{section.number}</span>
                  <span>{section.eyebrow}</span>
                </div>
                <h2>{section.title}</h2>
                <div className="card-bracket">[ {isRevealed ? "ABIERTA" : "BLOQUEADA"} ]</div>
                <div className="card-content">
                  <p>{section.content}</p>
                  {section.id === "implementacion" && (
                    <img
                      className="decorator-diagram"
                      src={diagramaDecoradores}
                      alt="Diagrama de Personaje, Enemigo, Decorator, Casco, Armadura y Botas"
                    />
                  )}
                  {section.code && (
                    <>
                      <pre className="code-cell"><code>{section.code.join("\n")}</code></pre>
                      <button
                        className="code-open-button"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsCodeOpen(true);
                        }}
                      >
                        Ampliar código ↗
                      </button>
                    </>
                  )}
                </div>
                {!isRevealed && <span className="card-cta">Pulsa para revelar ↗</span>}
              </article>
            );
          })}
        </section>

        <section className="footer-note" id="about">
          <span className="footer-symbol">✳</span>
          <p>El patrón no cambia al enemigo. Cambia lo que el enemigo puede hacer.</p>
          <span className="footer-caption">DECORATOR / COMPOSICIÓN / FLEXIBILIDAD</span>
        </section>
      </main>

      <Kirby
        targetPos={targetPos}
        onReachTarget={handleReachTarget}
        onChatArrive={handleChatArrive}
        onWakeUp={() => setTargetPos(null)}
        chatOpen={isChatOpen}
        chatPending={isChatPending}
        onToggleChat={isChatOpen ? handleChatToggle : handleKirbyDoubleClick}
      />
      {isChatOpen && (
        <aside className="kirby-chat" aria-label="Chat sobre el patrón Decorator">
          <div className="kirby-chat-header">
            <div>
              <span className="modal-kicker">KIRBY RESPONDE</span>
              <h2>Pregúntame sobre Decorator</h2>
            </div>
            <span className="chat-status">● EN LÍNEA</span>
          </div>
          <div className="kirby-chat-messages" aria-live="polite">
            {chatMessages.map((message, index) => (
              <p className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </p>
            ))}
            {isChatLoading && <p className="chat-message assistant">Pensando...</p>}
          </div>
          <form className="kirby-chat-form" onSubmit={handleChatSubmit}>
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Escribe una pregunta..."
              aria-label="Pregunta para Kirby"
              disabled={isChatLoading}
            />
            <button type="submit" disabled={isChatLoading || !chatInput.trim()}>Enviar</button>
          </form>
          <p className="chat-hint">Doble clic en Kirby para cerrar</p>
        </aside>
      )}
      {isCodeOpen && (
        <div className="code-modal-backdrop" role="presentation" onClick={() => setIsCodeOpen(false)}>
          <section
            className="code-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="codigo-ampliado"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="code-modal-header">
              <div>
                <span className="modal-kicker">CASO PRÁCTICO · JAVA</span>
                <h2 id="codigo-ampliado">Código ampliado</h2>
              </div>
              <button className="code-close-button" type="button" onClick={() => setIsCodeOpen(false)} aria-label="Cerrar código">
                Cerrar ×
              </button>
            </div>
            <pre className="code-modal-content"><code>{sections.find((section) => section.id === "codigo").code.join("\n")}</code></pre>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
