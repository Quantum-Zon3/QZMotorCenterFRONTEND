import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🏍️</div>
        <h1 style={{ fontSize: "4rem", fontWeight: 800, background: "linear-gradient(135deg, var(--text-white), var(--accent-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>404</h1>
        <p style={{ color: "var(--text-secondary)", margin: "1rem 0 2rem", fontSize: "1rem" }}>
          Esta ruta no existe en el sistema.
        </p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    </div>
  );
}