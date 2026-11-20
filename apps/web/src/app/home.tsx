import { Link } from "react-router-dom";
import { miniApps } from "../registry";
import { AppIcon } from "../registry/app-icon";
import { HeroScene } from "./HeroScene";
import { WHATSAPP_URL } from "../lib/contact";

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-brand">
          <img className="hero-brand-mark" src="/favicon.svg" alt="" />
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
            <div className="app-row-icon">
              <AppIcon name={app.icon} color={app.accent} width={20} height={20} />
            </div>
            <div className="app-row-info">
              <h2 className="app-row-name">{app.name}</h2>
              <p className="app-row-desc">{app.description}</p>
            </div>
            <span className="app-row-arrow">&rarr;</span>
          </Link>
        ))}
      </section>

      <footer className="home-footer">
        <p className="home-footer-text">
          <strong>¿Tienes una idea para mejorar equisproject?</strong> Enviamos tu sugerencia directamente al equipo.
        </p>
        <a
          className="contact-link"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04.5C5.68.5.5 5.68.5 12.04c0 2.04.53 4.03 1.55 5.79L.5 23.5l5.83-1.53a11.5 11.5 0 0 0 5.71 1.45h.01c6.36 0 11.54-5.18 11.54-11.54 0-3.09-1.2-5.99-3.07-8.4ZM12.05 21.02a9.58 9.58 0 0 1-4.88-1.34l-.35-.21-3.46.91.92-3.37-.23-.36a9.56 9.56 0 0 1-1.47-5.11c0-5.3 4.31-9.61 9.61-9.61a9.56 9.56 0 0 1 9.62 9.62c0 5.3-4.32 9.62-9.62 9.62Zm5.27-7.19c-.29-.15-1.71-.84-1.97-.94-.26-.1-.45-.15-.64.15-.19.29-.74.93-.9 1.12-.17.2-.33.22-.61.07-.29-.15-1.21-.45-2.31-1.42-.85-.76-1.43-1.7-1.59-1.99-.17-.29-.02-.44.12-.59.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.2.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1.01-1 2.46s1.03 2.85 1.17 3.05c.15.19 2.04 3.12 4.95 4.37.69.3 1.23.48 1.65.61.7.22 1.33.19 1.83.12.56-.08 1.71-.7 1.95-1.38.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
          </svg>
          Enviar sugerencia por WhatsApp
        </a>
      </footer>
    </>
  );
}
