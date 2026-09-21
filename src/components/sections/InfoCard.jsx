// Vista: tarjeta de sección con el mismo JSX y clases que la versión original.
import SectionContent from "./SectionContent";
import diagramaClases from "../../assets/diagrama-clases.png.png";

export default function InfoCard({
  section,
  isRevealed,
  onReveal,
  onOpenSection,
  onOpenCode,
  onOpenDiagram,
}) {
  const hasCode = section.type === "code";
  const hasDiagram = section.type === "diagram";
  const hasPatterns = section.type === "patterns";
  const showExpand = section.type === "text" || section.type === "prosCons" || section.type === "patterns";

  return (
    <article
      className={`info-card ${isRevealed ? "is-revealed" : ""} ${hasCode ? "has-code" : ""} ${hasDiagram ? "has-diagram" : ""} ${hasPatterns ? "has-patterns" : ""}`}
      onClick={(event) => onReveal(event, section.id)}
    >
      <div className="card-topline">
        <span>{section.number}</span>
        <span>{section.eyebrow}</span>
      </div>
      <h2>{section.title}</h2>
      <div className="card-bracket">[ {isRevealed ? "ABIERTA" : "BLOQUEADA"} ]</div>
      <div className="card-content">
        <SectionContent section={section} />
        {showExpand && (
          <button
            className="code-open-button section-open-button"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenSection(section);
            }}
          >
            Ampliar sección ↗
          </button>
        )}
        {hasDiagram && (
          <>
            <img
              className="decorator-diagram"
              src={diagramaClases}
              alt="Diagrama UML de Personaje, Enemigo, Decorador, Casco, Armadura, Pantalon y Botas"
            />
            <button
              className="code-open-button diagram-open-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenDiagram();
              }}
            >
              Ampliar diagrama ↗
            </button>
          </>
        )}
        {hasCode && (
          <>
            <pre className="code-cell"><code>{section.code.join("\n")}</code></pre>
            <button
              className="code-open-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenCode();
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
}
