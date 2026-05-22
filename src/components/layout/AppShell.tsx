import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

const navigation = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Usuarios", to: "/app/usuarios" },
  { label: "Autos", to: "/app/inventario/autos" },
  { label: "Motos", to: "/app/inventario/motos" },
  { label: "Electrobikes", to: "/app/inventario/electrobikes" },
  { label: "Scooters", to: "/app/inventario/scooters" },
  { label: "Reportes", to: "/app/reportes" },
  { label: "IA", to: "/app/ia" },
  { label: "Arquitectura", to: "/app/arquitectura" },
  { label: "Configuración", to: "/app/configuracion" },
];

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, session } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <img src="/logo-mark.svg" alt="QZ Motor Center" className="brand-mark small" />
          <div>
            <strong>QZ Control Room</strong>
            <span>Backoffice modular</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <strong>
            {session?.user?.nombre
              ? `${session.user.nombre} ${session.user.apellido ?? ""}`.trim()
              : session?.user?.email ?? "Sin sesión activa"}
          </strong>
          <span>{session?.user?.telefono ?? "Operador del sistema"}</span>
          <button className="btn btn-secondary full-width" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="app-content-shell">
        <header className="app-topbar">
          <button className="menu-toggle" onClick={() => setMenuOpen((current) => !current)}>
            Menú
          </button>
          <div>
            <span className="eyebrow">Operación interna</span>
            <h1>Panel base del frontend</h1>
          </div>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
