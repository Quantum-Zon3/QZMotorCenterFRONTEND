import { Link, NavLink, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header className="public-header">
        <Link to="/" className="public-header-logo">
          <div className="public-header-logo-icon">🏍️</div>
          <span>QZ Motor Center</span>
        </Link>

        <nav className="public-nav">
          <NavLink to="/catalogo/autos">Autos</NavLink>
          <NavLink to="/catalogo/motos">Motos</NavLink>
          <NavLink to="/catalogo/electrobikes">Electrobikes</NavLink>
          <NavLink to="/catalogo/scooters">Scooters</NavLink>
          <Link to="/login" className="btn btn-primary btn-sm" style={{ marginLeft: "0.5rem" }}>
            Ingresar
          </Link>
        </nav>
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <p>© {new Date().getFullYear()} QZ Motor Center · Plataforma de gestión multimarca</p>
      </footer>
    </div>
  );
}