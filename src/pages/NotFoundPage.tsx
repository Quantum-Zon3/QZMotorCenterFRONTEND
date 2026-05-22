import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="screen-center">
      <div className="surface-card compact-card">
        <span className="eyebrow">404</span>
        <h2>La ruta no existe todavía</h2>
        <p>
          Este frontend está en construcción por fases. Puedes volver al inicio o
          entrar al panel.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/">
            Volver al inicio
          </Link>
          <Link className="btn btn-secondary" to="/app/dashboard">
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

