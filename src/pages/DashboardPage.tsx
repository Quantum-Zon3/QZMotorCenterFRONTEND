import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import {
  MdPeople, MdDirectionsCar, MdDirectionsBike,
  MdElectricBike, MdElectricScooter, MdBarChart,
  MdSmartToy, MdAdd
} from "react-icons/md";
import { getResumenCatalogo } from "../features/electrobike/electrobike.api";
import { useEffect, useState } from "react";
import { getAllReports, type Reporte } from "../features/reports/reports.api";
import { formatCurrency } from "../lib/formatters";

const baseStats = [
  { label: "Usuarios", value: "—", icon: <MdPeople />, color: "purple", sub: "Auth · Spring Boot" },
  { label: "Autos", value: "—", icon: <MdDirectionsCar />, color: "teal", sub: "Cars · Node + PostgreSQL" },
  { label: "Motos", value: "—", icon: <MdDirectionsBike />, color: "orange", sub: "Motorcycles · Flask" },
  { label: "Electrobikes", value: "—", icon: <MdElectricBike />, color: "blue", sub: "ElectroBike · Node" },
  { label: "Scooters", value: "—", icon: <MdElectricScooter />, color: "green", sub: "Scooter · Node" },
  { label: "Reportes", value: "—", icon: <MdBarChart />, color: "pink", sub: "Reports · MongoDB" },
];

const quickActions = [
  { title: "Usuarios", icon: <MdPeople />, desc: "Gestiona compradores y administradores del sistema.", to: "/app/usuarios", btnLabel: "Ir a Usuarios" },
  { title: "Autos", icon: <MdDirectionsCar />, desc: "Inventario de automóviles. Agrega, edita o elimina registros.", to: "/app/inventario/autos", btnLabel: "Ver Autos" },
  { title: "Motos", icon: <MdDirectionsBike />, desc: "Catálogo de motocicletas con cilindraje y estado.", to: "/app/inventario/motos", btnLabel: "Ver Motos" },
  { title: "Electrobikes", icon: <MdElectricBike />, desc: "Bicicletas eléctricas — autonomía, voltaje y stock.", to: "/app/inventario/electrobikes", btnLabel: "Ver Electrobikes" },
  { title: "Scooters", icon: <MdElectricScooter />, desc: "Scooters eléctricas urbanas por marca y modelo.", to: "/app/inventario/scooters", btnLabel: "Ver Scooters" },
  { title: "Asistente IA", icon: <MdSmartToy />, desc: "Consulta al asistente inteligente del sistema.", to: "/app/ia", btnLabel: "Abrir IA" },
];

export default function DashboardPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [totalElectroBikes, setTotalElectroBikes] = useState<number | null>(null);
  const [reports, setReports] = useState<Reporte[]>([]);
  const [reportsCount, setReportsCount] = useState<number | null>(null);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resumen, reportsData] = await Promise.all([
          getResumenCatalogo().catch(() => null),
          getAllReports().catch(() => null),
        ]);

        if (resumen) {
          setTotalElectroBikes(resumen.totalElectroBikes);
        }
        if (reportsData) {
          setReports(reportsData.data || []);
          setReportsCount(reportsData.total ?? reportsData.data?.length ?? 0);
        }
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoadingReports(false);
      }
    };

    loadData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const displayName = session?.user?.nombre ?? "Admin";

  const stats = baseStats.map((stat) => {
    if (stat.label === "Electrobikes") {
      return { ...stat, value: totalElectroBikes ?? "—" };
    }
    if (stat.label === "Reportes") {
      const count = reportsCount ?? (reports.length > 0 ? reports.length : null);
      return { ...stat, value: count !== null ? String(count) : "—" };
    }
    return stat;
  });

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>{greeting()}, {displayName} 👋</h1>
        <p>Aquí tienes el resumen de tu centro de gestión multimarca</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <h3>{s.label}</h3>
              <div className="stat-value">{s.value}</div>
              <div className="stat-change">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{ marginBottom: "1rem", fontSize: "1.15rem" }}>Acceso rápido</h2>
      <div className="quick-actions">
        {quickActions.map((qa) => (
          <div key={qa.to} className="quick-action-card">
            <h3>{qa.icon} {qa.title}</h3>
            <p>{qa.desc}</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(qa.to)}
            >
              <MdAdd /> {qa.btnLabel}
            </button>
          </div>
        ))}
      </div>

      {/* Reportes Recientes Section */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
            <MdBarChart style={{ color: "var(--accent-light)", fontSize: "1.4rem" }} /> Reportes recientes
          </h2>
          <span className="badge badge-purple" style={{ textTransform: "uppercase", fontSize: "0.68rem", padding: "0.25rem 0.65rem" }}>
            Reports Service · MongoDB
          </span>
        </div>

        {loadingReports ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            <span style={{ animation: "pulse 1.5s infinite" }}>Cargando reportes del microservicio...</span>
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚡</div>
            <h3 style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Sin reportes registrados</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto" }}>
              Aquí verás todos los reportes que genere el servicio: creación, venta, eliminación y otros eventos.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {reports.slice(0, 5).map((report) => {
              const eventType = report.status === "cancelled" ? "delete" : "sale";
              const eventLabel =
                eventType === "delete" ? "ELIMINADO" :
                eventType === "sale" ? "VENTA" :
                eventType === "create" ? "CREACIÓN" :
                "GENERAL";
              const badgeColor =
                eventType === "delete" ? "var(--danger)" :
                eventType === "sale" ? "var(--warning)" :
                eventType === "create" ? "var(--success)" :
                "var(--primary)";

              return (
                <div 
                  key={report._id} 
                  className="report-item-hover"
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "0.85rem 1.15rem", 
                    background: "var(--bg-secondary)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate("/app/reportes")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <div style={{ 
                      width: 38, 
                      height: 38, 
                      borderRadius: "var(--radius-sm)", 
                      background: badgeColor,
                      color: "var(--bg-base)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      fontWeight: 700
                    }}>
                      {eventLabel[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-white)", marginBottom: "0.15rem" }}>
                        {report.items && report.items.length > 0 
                          ? report.items.map(i => i.productName).join(", ") 
                          : "Reporte general"}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="badge badge-purple" style={{ fontSize: "0.6rem", padding: "0.1rem 0.35rem" }}>
                          {eventType.toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>ID: {report._id.substring(0, 8)}...</span>
                        <span>•</span>
                        <span>{new Date(report.saleDate).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-white)", fontSize: "0.95rem" }}>
                      {report.totalAmount > 0 ? formatCurrency(report.totalAmount) : "0"}
                    </div>
                    <span className="badge" style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem", marginTop: "0.2rem", background: badgeColor, color: "var(--bg-base)" }}>
                      {eventLabel}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {reports.length > 5 && (
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => navigate("/app/reportes")}
                  style={{ fontSize: "0.75rem" }}
                >
                  Ver todos los {reports.length} reportes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
