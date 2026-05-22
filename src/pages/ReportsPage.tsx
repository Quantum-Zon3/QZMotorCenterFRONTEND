import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ServiceBadge from "../components/ui/ServiceBadge";
import { serviceRegistry } from "../config/service-registry";
import { reportsClient } from "../lib/http/clients";
import { clampText } from "../lib/formatters";

export default function ReportsPage() {
  const [reports, setReports] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const { data } = await reportsClient.get<Array<Record<string, unknown>>>(
          "/api/reports",
        );
        setReports(Array.isArray(data) ? data : []);
      } catch {
        setError(
          "El servicio de reportes no respondió; la vista queda lista para cuando el backend esté operativo.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadReports();
  }, []);

  return (
    <div className="page-stack">
      <section className="surface-card">
        <PageHeader
          eyebrow="Analítica"
          title="Reportes de negocio"
          description="La base del panel contempla reportes por cliente, producto y periodo desde MongoDB."
        />

        <div className="chip-row">
          <ServiceBadge value={serviceRegistry.reports.stack} />
          <ServiceBadge value="/api/reports/by-customer/:customerId" />
          <ServiceBadge value="/api/reports/by-period" />
        </div>

        {error ? <div className="feedback warning">{error}</div> : null}

        {loading ? (
          <div className="screen-center compact">
            <div className="loading-dot" />
            <p>Consultando reportes...</p>
          </div>
        ) : (
          <div className="data-grid">
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <article key={index} className="info-card">
                  <h3>Reporte #{index + 1}</h3>
                  <ul className="meta-list">
                    {Object.entries(report)
                      .slice(0, 5)
                      .map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {clampText(String(value))}
                        </li>
                      ))}
                  </ul>
                </article>
              ))
            ) : (
              <article className="empty-panel">
                <h3>Sin reportes cargados aún</h3>
                <p>
                  El contenedor visual del módulo ya existe. El siguiente paso es
                  definir tablas, filtros y tarjetas según el modelo final.
                </p>
              </article>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

