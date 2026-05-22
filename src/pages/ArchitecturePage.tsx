import PageHeader from "../components/ui/PageHeader";
import ServiceBadge from "../components/ui/ServiceBadge";
import {
  appSections,
  buildPhases,
  serviceList,
} from "../config/service-registry";

export default function ArchitecturePage() {
  return (
    <div className="page-stack">
      <section className="surface-card">
        <PageHeader
          eyebrow="Arquitectura"
          title="Cómo queda diseñado este frontend"
          description="Aquí está plasmada la estrategia para construir por fases sin perder compatibilidad con despliegue, Docker ni microservicios."
        />

        <div className="architecture-columns">
          <div className="surface-subcard">
            <h3>Secciones del producto</h3>
            <div className="stack-list">
              {appSections.map((section) => (
                <article key={section.title} className="list-card">
                  <strong>{section.title}</strong>
                  <p>{section.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-subcard">
            <h3>Orden de implementación</h3>
            <div className="stack-list">
              {buildPhases.map((phase) => (
                <article key={phase.title} className="list-card">
                  <strong>{phase.title}</strong>
                  <p>{phase.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card">
        <PageHeader
          eyebrow="Microservicios"
          title="Responsabilidad de cada conexión"
          description="El frontend nuevo ya distingue qué módulo debe hablar con cada backend."
        />

        <div className="service-grid">
          {serviceList.map((service) => (
            <article key={service.key} className="service-card">
              <div className="chip-row">
                <ServiceBadge value={service.tab} />
                <ServiceBadge value={service.category} />
              </div>
              <h3>{service.label}</h3>
              <p>{service.description}</p>
              <code>{service.baseUrl}</code>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

