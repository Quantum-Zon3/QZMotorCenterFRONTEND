import { Link } from "react-router-dom";
import {
  MdDirectionsCar, MdDirectionsBike, MdElectricBike,
  MdElectricScooter, MdVerified, MdArrowForward
} from "react-icons/md";
const catalogs = [
  {
    icon: <MdDirectionsCar />,
    label: "Autos",
    desc: "Catálogo de automóviles disponibles",
    to: "/catalogo/autos",
    emoji: "🚗",
  },
  {
    icon: <MdDirectionsBike />,
    label: "Motos",
    desc: "Motocicletas de todos los cilindrajes",
    to: "/catalogo/motos",
    emoji: "🏍️",
  },
  {
    icon: <MdElectricBike />,
    label: "Electrobikes",
    desc: "Bicicletas eléctricas y movilidad sostenible",
    to: "/catalogo/electrobikes",
    emoji: "⚡",
  },
  {
    icon: <MdElectricScooter />,
    label: "Scooters",
    desc: "Scooters eléctricos urbanos",
    to: "/catalogo/scooters",
    emoji: "🛴",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <MdVerified /> Plataforma de Gestión Multimarca
        </div>
        <h1>QZ Motor Center</h1>
        <p>
          Sistema integral de gestión de vehículos independientes.
          Explora el catálogo o accede al panel administrativo.
        </p>
        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary">
            Ingresar al panel <MdArrowForward />
          </Link>
          <Link to="/catalogo/autos" className="btn btn-secondary">
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div className="home-section">
        {/* Catalog preview */}
        <h2 className="home-section-title">Explora el Catálogo</h2>
        <p className="home-section-sub">
          Navega por las categorías de vehículos disponibles en nuestra plataforma.
        </p>
        <div className="catalog-grid">
          {catalogs.map((c) => (
            <Link key={c.to} to={c.to} className="catalog-card">
              <div className="catalog-card-icon">{c.emoji}</div>
              <h3>{c.label}</h3>
              <p>{c.desc}</p>
              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-light)", fontSize: "0.82rem" }}>
                Ver catálogo <MdArrowForward />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}