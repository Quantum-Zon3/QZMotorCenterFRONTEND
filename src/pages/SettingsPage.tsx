const services = [
  { name: "Auth", icon: "🔐", tech: "Spring Boot + JWT + MySQL", url: "http://localhost:8080", status: "activo" },
  { name: "Cars", icon: "🚗", tech: "Node + Express + PostgreSQL", url: "http://localhost:3001", status: "activo" },
  { name: "Motorcycles", icon: "🏍️", tech: "Flask + SQLAlchemy + MySQL", url: "http://localhost:5000", status: "activo" },
  { name: "ElectroBike", icon: "⚡", tech: "Node + Express + Sequelize", url: "http://localhost:3002", status: "activo" },
  { name: "Scooter", icon: "🛴", tech: "Node + Express + MySQL", url: "http://localhost:3003", status: "activo" },
  { name: "Reports", icon: "📈", tech: "Node + Express + MongoDB", url: "http://localhost:3004", status: "activo" },
  { name: "IA", icon: "🤖", tech: "FastAPI + PostgreSQL", url: "http://localhost:8001", status: "inactivo" },
  { name: "Serverless", icon: "☁️", tech: "AWS Lambda / Functions", url: "—", status: "inactivo" },
];

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Configuración</h1>
          <p>Mapa de microservicios y estado del sistema</p>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Microservicios</h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          Los 8 microservicios del ecosistema QZ Motor Center. Las URLs corresponden al entorno local.
          En producción se configuran mediante variables de entorno.
        </p>
        <div className="settings-grid">
          {services.map((s) => (
            <div key={s.name} className="service-card">
              <div className="service-card-header">
                <div className="service-card-icon">{s.icon}</div>
                <div>
                  <div className="service-card-name">{s.name}</div>
                  <div className="service-card-tech">{s.tech}</div>
                </div>
                <span className={`badge ${s.status === "activo" ? "badge-success" : "badge-warning"}`} style={{ marginLeft: "auto" }}>
                  {s.status}
                </span>
              </div>
              <code className="service-card-url">{s.url}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ maxWidth: "500px" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Información del frontend</h3>
        <table style={{ fontSize: "0.85rem" }}>
          <tbody>
            {[
              ["Framework", "React 18 + TypeScript"],
              ["Build tool", "Vite"],
              ["Estilos", "CSS Variables · Glassmorphism"],
              ["Router", "React Router v6"],
              ["Iconos", "react-icons (Material Design)"],
              ["Deploy", "Docker / Render"],
            ].map(([k, v]) => (
              <tr key={k}>
                <td style={{ paddingRight: "1.5rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>{k}</td>
                <td style={{ fontWeight: 500, borderBottom: "1px solid var(--border)" }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}