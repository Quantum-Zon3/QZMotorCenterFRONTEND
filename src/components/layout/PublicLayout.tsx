import { Link, NavLink, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="public-header">
        <Link to="/" className="public-header-logo">
          <div className="public-header-logo-icon">QZ</div>
          <span>QZ Motor Center</span>
        </Link>

        <nav className="public-nav">
          <NavLink to="/login">Ingresar</NavLink>
          <Link to="/registro" className="btn btn-primary btn-sm" style={{ marginLeft: "0.5rem" }}>
            Crear usuario
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="public-footer">
        <p>QZ Motor Center - Plataforma de gestion conectada al API Gateway</p>
      </footer>
    </div>
  );
}
