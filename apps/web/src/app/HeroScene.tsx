export function HeroScene() {
  return (
    <div className="hero-scene">
      <div className="hero-cube-perspective">
        <div className="hero-cube">
          {/* Front - Ship */}
          <div className="hero-cube-face hero-cube-front">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 48h56"/>
              <path d="M8 48l4-20h40l4 20"/>
              <path d="M12 28l4-8h8l4 8"/>
              <path d="M32 12v8M32 12l-12 8M32 12l12 8"/>
              <path d="M20 48c0 4 5.4 6 12 6s12-2 12-6"/>
              <circle cx="18" cy="44" r="1.5" fill="currentColor"/>
              <circle cx="32" cy="44" r="1.5" fill="currentColor"/>
              <circle cx="46" cy="44" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          {/* Back - Truck */}
          <div className="hero-cube-face hero-cube-back">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="22" width="32" height="22" rx="2"/>
              <path d="M36 30h14l8 8v6H36V30z"/>
              <path d="M36 36h14"/>
              <circle cx="16" cy="48" r="4"/>
              <circle cx="48" cy="48" r="4"/>
              <line x1="20" y1="48" x2="44" y2="48"/>
              <rect x="8" y="26" width="8" height="6" rx="1"/>
            </svg>
          </div>
          {/* Right - Airplane */}
          <div className="hero-cube-face hero-cube-right">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M32 8v48"/>
              <path d="M8 28l12-4 12 4 12-4 12 4"/>
              <path d="M20 28v16M44 28v16"/>
              <path d="M26 56l6-4 6 4"/>
              <circle cx="32" cy="16" r="3"/>
            </svg>
          </div>
          {/* Left - Container */}
          <div className="hero-cube-face hero-cube-left">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="14" width="48" height="36" rx="2"/>
              <line x1="8" y1="26" x2="56" y2="26"/>
              <line x1="8" y1="38" x2="56" y2="38"/>
              <line x1="24" y1="14" x2="24" y2="50"/>
              <line x1="40" y1="14" x2="40" y2="50"/>
              <rect x="11" y="18" width="10" height="5" rx="1"/>
              <rect x="27" y="18" width="10" height="5" rx="1"/>
              <rect x="43" y="18" width="10" height="5" rx="1"/>
            </svg>
          </div>
          {/* Top - Warehouse */}
          <div className="hero-cube-face hero-cube-top">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 34l24-18 24 18"/>
              <rect x="14" y="34" width="36" height="18" rx="1"/>
              <rect x="26" y="38" width="12" height="14" rx="1"/>
              <line x1="32" y1="38" x2="32" y2="52"/>
            </svg>
          </div>
          {/* Bottom - Box/Package */}
          <div className="hero-cube-face hero-cube-bottom">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M32 8L8 22v20l24 14 24-14V22z"/>
              <line x1="32" y1="32" x2="32" y2="56"/>
              <line x1="8" y1="22" x2="32" y2="36"/>
              <line x1="56" y1="22" x2="32" y2="36"/>
              <path d="M24 14l8 6 8-6"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="hero-glow" />
    </div>
  );
}
