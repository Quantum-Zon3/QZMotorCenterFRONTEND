import { Link, NavLink, Outlet } from "react-router-dom";
import { env } from "../../config/env";
import { productTabs } from "../../config/service-registry";
import { useAuth } from "../../features/auth/useAuth";

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="public-shell">
      <header className="public-header">
        <Link className="brand-lockup" to="/">
          <img src="/logo-mark.svg" alt="QZ Motor Center" className="brand-mark" />
          <div>
            <strong>{env.appName}</strong>
            <span>Frontend base para microservicios</span>
          </div>
        </Link>

        <nav className="public-nav">
          {productTabs.map((tab) => (
            <NavLink
              key={tab.label}
              to={tab.path}
              className={({ isActive }) =>
                isActive ? "public-link active" : "public-link"
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <Link className="btn btn-primary" to={isAuthenticated ? "/app/dashboard" : "/login"}>
          {isAuthenticated ? "Ir al panel" : "Entrar"}
        </Link>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <p>{env.appName} está naciendo como un frontend desacoplado, desplegable y listo para crecer por fases.</p>
      </footer>
    </div>
  );
}
