import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { formatCompact } from "../lib/formatters";
import {
  loadDashboardOverview,
  type DashboardOverview,
} from "../features/dashboard/dashboard.api";

const initialOverview: DashboardOverview = {
  metrics: [],
  serviceHealth: [],
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview>(initialOverview);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const nextOverview = await loadDashboardOverview();
        setOverview(nextOverview);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  return (
    <div className="page-stack">
      <section className="surface-card">
        <PageHeader
          eyebrow="Dashboard"
          title="Resumen operativo del foundation"
          description="El objetivo de este panel es validar rápido la arquitectura del frontend antes de entrar al CRUD completo."
        />

        <div className="stat-grid">
          {overview.metrics.map((metric) => (
            <StatCard
              key={metric.label}
              label={metric.label}
              value={loading ? "..." : formatCompact(metric.value)}
              detail={metric.detail}
            />
          ))}
        </div>
      </section>

      <section className="surface-card">
        <PageHeader
          eyebrow="Conectividad"
          title="Estado inicial de servicios"
          description="No todos los servicios tienen health-check. Cuando no existe, el frontend lo marca como revisión manual."
        />

        <div className="health-grid">
          {overview.serviceHealth.map((service) => (
            <article key={service.key} className="health-card">
              <div className="health-header">
                <strong>{service.label}</strong>
                <span className={`status-pill ${service.status}`}>{service.status}</span>
              </div>
              <p>{service.detail}</p>
              <code>{service.endpoint}</code>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

