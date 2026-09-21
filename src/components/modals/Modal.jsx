// Vista: contenedor compartido para los modales del sitio.
export default function Modal({
  kicker,
  title,
  titleId,
  closeLabel,
  className,
  onClose,
  children,
}) {
  return (
    <div className="code-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className={`code-modal ${className || ""}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="code-modal-header">
          <div>
            <span className="modal-kicker">{kicker}</span>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button className="code-close-button" type="button" onClick={onClose} aria-label={closeLabel}>
            Cerrar ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
