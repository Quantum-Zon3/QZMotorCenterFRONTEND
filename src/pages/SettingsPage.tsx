import { serviceList } from "../config/service-registry";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Configuracion</h1>
          <p>Mapa de microservicios y estado del sistema via API Gateway</p>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Microservicios</h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          El frontend consume una sola base URL: el API Gateway. Cada tarjeta muestra la ruta publica
          que el gateway enruta hacia el microservicio correspondiente.
        </p>
        <div className="settings-grid">
          {serviceList.map((service) => (
            <div key={service.key} className="service-card">
              <div className="service-card-header">
                <div>
                  <div className="service-card-name">{service.label}</div>
                  <div className="service-card-tech">{service.stack}</div>
                </div>
                <span className="badge badge-success" style={{ marginLeft: "auto" }}>
                  activo
                </span>
              </div>
              <code className="service-card-url">
                {service.baseUrl}
                {service.routeBase}
              </code>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ maxWidth: "500px" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Informacion del frontend</h3>
        <table style={{ fontSize: "0.85rem" }}>
          <tbody>
            {[
              ["Framework", "React + TypeScript"],
              ["Build tool", "Vite"],
              ["Estilos", "CSS Variables"],
              ["Router", "React Router"],
              ["Iconos", "react-icons"],
              ["Deploy", "Docker / Render"],
            ].map(([key, value]) => (
              <tr key={key}>
                <td style={{ paddingRight: "1.5rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>{key}</td>
                <td style={{ fontWeight: 500, borderBottom: "1px solid var(--border)" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
