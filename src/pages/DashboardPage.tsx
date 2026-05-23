import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import {
  MdPeople, MdDirectionsCar, MdDirectionsBike,
  MdElectricBike, MdElectricScooter, MdBarChart,
  MdSmartToy, MdAdd
} from "react-icons/md";
import { getResumenCatalogo } from "../features/electrobike/electrobike.api";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const loadResumen = async () => {
      try {
        const resumen = await getResumenCatalogo();
        setTotalElectroBikes(resumen.totalElectroBikes);
      } catch (error) {
        console.error("Error cargando resumen de Electrobikes:", error);
      }
    };

    loadResumen();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const displayName = session?.user?.nombre ?? "Admin";

  const stats = baseStats.map((stat) =>
    stat.label === "Electrobikes"
      ? { ...stat, value: totalElectroBikes ?? "—" }
      : stat
  );

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
    </div>
  );
}