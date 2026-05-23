import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import {
  MdDashboard, MdPeople, MdDirectionsCar, MdDirectionsBike,
  MdElectricBike, MdElectricScooter, MdBarChart, MdSmartToy,
  MdSettings, MdLogout, MdPerson, MdMenu, MdClose
} from "react-icons/md";

const navSections = [
  {
    title: "Principal",
    items: [
      { label: "Dashboard", to: "/app/dashboard", icon: <MdDashboard /> },
      { label: "Mi Perfil", to: "/app/perfil", icon: <MdPerson /> },
    ],
  },
  {
    title: "Inventario",
    items: [
      { label: "Usuarios", to: "/app/usuarios", icon: <MdPeople /> },
      { label: "Autos", to: "/app/inventario/autos", icon: <MdDirectionsCar /> },
      { label: "Motos", to: "/app/inventario/motos", icon: <MdDirectionsBike /> },
      { label: "Electrobikes", to: "/app/inventario/electrobikes", icon: <MdElectricBike /> },
      { label: "Scooters", to: "/app/inventario/scooters", icon: <MdElectricScooter /> },
    ],
  },
  {
    title: "Herramientas",
    items: [
      { label: "Reportes", to: "/app/reportes", icon: <MdBarChart /> },
      { label: "Asistente IA", to: "/app/ia", icon: <MdSmartToy /> },
      { label: "Configuración", to: "/app/configuracion", icon: <MdSettings /> },
    ],
  },
];

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, session } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userName = session?.user?.nombre
    ? `${session.user.nombre} ${session.user.apellido ?? ""}`.trim()
    : session?.user?.email ?? "Usuario";

  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = (session?.user as { role?: string })?.role ?? "Operador";

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏍️</div>
          <div>
            <h1>QZ Motor</h1>
            <span>Centro de Gestión</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.title}>
              <span className="sidebar-section-title">{section.title}</span>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{userInitial}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userName}</div>
              <div className="sidebar-user-role">{userRole}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <MdLogout /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="app-content">
        {/* Mobile topbar */}
        <header className="app-topbar">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú"
          >
            {menuOpen ? <MdClose /> : <MdMenu />}
          </button>
          <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text-white)" }}>
            QZ Motor Center
          </span>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 150,
          }}
        />
      )}
    </div>
  );
}