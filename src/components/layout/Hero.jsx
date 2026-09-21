// Vista: bloque principal de hero del sitio.
export default function Hero() {
  return (
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
  );
}
