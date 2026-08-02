import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="hero" style={{ textAlign: "center", paddingTop: 120 }}>
      <h1 className="page-title">404</h1>
      <p className="page-subtitle" style={{ marginBottom: 32 }}>Página no encontrada</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </section>
  );
}
