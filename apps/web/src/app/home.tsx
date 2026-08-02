import { Link } from "react-router-dom";
import { miniApps } from "../registry";
import { AppIcon } from "../registry/app-icon";
import { HeroScene } from "./HeroScene";

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-brand">
          <span className="hero-brand-mark">X</span>
          <span className="hero-brand-text">equisproject</span>
        </div>
        <HeroScene />
        <h1 className="hero-title">
          Aplicaciones <span className="hero-accent">logísticas</span>
        </h1>
        <p className="hero-sub">
          Herramientas simples, rápidas y útiles para operaciones de importación.
        </p>
        <div className="hero-badges">
          <span className="hero-badge">100% gratis</span>
          <span className="hero-badge">Sin login</span>
          <span className="hero-badge">Sin registro</span>
          <span className="hero-badge">Sin límites</span>
        </div>
      </section>

      <section className="apps-grid">
        {miniApps.map((app) => (
          <Link key={app.id} to={app.path} className="app-row">
            <div className="app-row-icon" style={{ color: app.accent }}>
              <AppIcon name={app.icon} width={22} height={22} />
            </div>
            <div className="app-row-info">
              <h2 className="app-row-name">{app.name}</h2>
              <p className="app-row-desc">{app.description}</p>
            </div>
            <span className="app-row-arrow">&rarr;</span>
          </Link>
        ))}
      </section>
    </>
  );
}
