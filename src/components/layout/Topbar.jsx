// Vista: barra superior del sitio.
export default function Topbar() {
  return (
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
  );
}
