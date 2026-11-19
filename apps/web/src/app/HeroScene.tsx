export function HeroScene() {
  return (
    <div className="hero-scene">
      <svg className="hero-defs" width="0" height="0" aria-hidden="true">
        <defs>
          <linearGradient id="heroSteel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C4FFE6" />
            <stop offset="0.5" stopColor="#43FEA4" />
            <stop offset="1" stopColor="#129B69" />
          </linearGradient>
        </defs>
      </svg>

      <div className="hero-cube-perspective">
        <div className="hero-cube">
          {/* Frente — Aduana (DUA con sello) */}
          <div className="hero-cube-face hero-cube-front">
            <svg viewBox="0 0 64 64" fill="none" stroke="url(#heroSteel)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 6h24l10 10v40a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
              <path d="M38 6v10h10" />
              <path d="M18 24h22M18 30h16" />
              <circle cx="40" cy="44" r="8" />
              <path d="M35.5 44l3 3 6-6.5" />
            </svg>
          </div>

          {/* Atrás — Flete terrestre */}
          <div className="hero-cube-face hero-cube-back">
            <svg viewBox="0 0 64 64" fill="none" stroke="url(#heroSteel)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="20" width="32" height="22" rx="2" />
              <path d="M36 28h14l8 8v6H36V28z" />
              <path d="M36 34h14" />
              <circle cx="16" cy="50" r="4" />
              <circle cx="48" cy="50" r="4" />
              <path d="M20 50h24" />
              <rect x="9" y="25" width="9" height="6" rx="1" />
            </svg>
          </div>

          {/* Derecha — Carga aérea */}
          <div className="hero-cube-face hero-cube-right">
            <svg viewBox="0 0 64 64" fill="none" stroke="url(#heroSteel)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M32 6v52" />
              <path d="M8 30l12-4 12 4 12-4 12 4" />
              <path d="M20 30v16M44 30v16" />
              <path d="M26 58l6-4 6 4" />
              <circle cx="32" cy="17" r="3" />
            </svg>
          </div>

          {/* Izquierda — Contenedor marítimo */}
          <div className="hero-cube-face hero-cube-left">
            <svg viewBox="0 0 64 64" fill="none" stroke="url(#heroSteel)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="7" y="16" width="50" height="32" rx="2" />
              <path d="M7 28h50M7 40h50M24 16v32M40 16v32" />
              <path d="M11 21h8M27 21h8M43 21h8" />
            </svg>
          </div>

          {/* Arriba — Almacén */}
          <div className="hero-cube-face hero-cube-top">
            <svg viewBox="0 0 64 64" fill="none" stroke="url(#heroSteel)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 34l24-18 24 18" />
              <rect x="14" y="34" width="36" height="18" rx="1" />
              <rect x="26" y="39" width="12" height="13" rx="1" />
              <path d="M32 39v13" />
            </svg>
          </div>

          {/* Abajo — Tracking / código de barras */}
          <div className="hero-cube-face hero-cube-bottom">
            <svg viewBox="0 0 64 64" fill="none" stroke="url(#heroSteel)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="12" width="48" height="40" rx="3" />
              <path d="M15 20v20M20 20v20M25 20v14M30 20v20M36 20v14M41 20v20M46 20v20" />
            </svg>
          </div>
        </div>
      </div>

      <div className="hero-glow" />
    </div>
  );
}
