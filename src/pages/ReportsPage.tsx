import { MdBarChart, MdTrendingUp, MdAttachMoney, MdInventory } from "react-icons/md";

const summaryCards = [
  { label: "Ventas del mes", value: "$142M", icon: <MdAttachMoney />, color: "teal", change: "+12% vs mes anterior" },
  { label: "Vehículos vendidos", value: "38", icon: <MdInventory />, color: "purple", change: "+5 este mes" },
  { label: "Ingreso promedio", value: "$3.7M", icon: <MdTrendingUp />, color: "orange", change: "por vehículo" },
  { label: "Total reportes", value: "156", icon: <MdBarChart />, color: "blue", change: "generados este año" },
];

const chartPlaceholders = [
  { title: "Ventas por categoría", desc: "Autos · Motos · Electrobikes · Scooters" },
  { title: "Ingresos mensuales", desc: "Tendencia de los últimos 12 meses" },
  { title: "Top 5 marcas", desc: "Marcas más vendidas del período" },
  { title: "Stock disponible", desc: "Inventario actual por categoría" },
];

export default function ReportsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Reportes</h1>
          <p>Panel de reportes y analítica — microservicio Reports · Node + Express + MongoDB</p>
        </div>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        {summaryCards.map((c) => (
          <div key={c.label} className="stat-card">
            <div className={`stat-icon ${c.color}`}>{c.icon}</div>
            <div className="stat-info">
              <h3>{c.label}</h3>
              <div className="stat-value">{c.value}</div>
              <div className="stat-change positive">{c.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="reports-grid">
        {chartPlaceholders.map((p) => (
          <div key={p.title} className="report-card">
            <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{p.title}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{p.desc}</p>
            <div className="chart-placeholder">
              <span>📊 Gráfica disponible al conectar API</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}