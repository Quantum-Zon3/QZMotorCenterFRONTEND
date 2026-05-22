import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ServiceBadge from "../components/ui/ServiceBadge";
import {
  appSections,
  buildPhases,
  productTabs,
  serviceList,
} from "../config/service-registry";

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Fase 1 del proyecto</span>
          <h1>Un frontend React listo para crecer junto a 8 microservicios.</h1>
          <p>
            La nueva base de QZ Motor Center nace desacoplada, dockerizada y
            preparada para un catálogo público más un backoffice operativo.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/login">
              Probar acceso
            </Link>
            <Link className="btn btn-secondary" to="/catalogo/autos">
              Ver catálogo base
            </Link>
          </div>
        </div>

        <div className="hero-metrics">
          <div className="metric-box">
            <strong>8</strong>
            <span>microservicios detectados</span>
          </div>
          <div className="metric-box">
            <strong>2</strong>
            <span>caras del producto: público + panel interno</span>
          </div>
          <div className="metric-box">
            <strong>Docker</strong>
            <span>listo como estrategia de publicación</span>
          </div>
        </div>
      </section>

      <section className="surface-card">
        <PageHeader
          eyebrow="Diseño propuesto"
          title="Pestañas que tendrá el proyecto"
          description="Este es el mapa inicial de navegación para construir la fase de foundation sin perder la visión completa."
        />

        <div className="feature-grid">
          {appSections.map((section) => (
            <article key={section.title} className="info-card">
              <h3>{section.title}</h3>
              <p>{section.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card">
        <PageHeader
          eyebrow="Inventario público"
          title="Dominios ya pensados como catálogo"
          description="Estos módulos son los primeros candidatos para vistas públicas y posicionamiento del sitio."
        />

        <div className="catalog-preview-grid">
          {productTabs.map((tab) => (
            <article key={tab.label} className="catalog-preview-card">
              <div className="chip-row">
                <ServiceBadge value={tab.service.stack} />
                <ServiceBadge value={tab.service.audience} />
              </div>
              <h3>{tab.label}</h3>
              <p>{tab.service.description}</p>
              <Link className="text-link" to={tab.path}>
                Ir al módulo
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card">
        <PageHeader
          eyebrow="Fases"
          title="Cómo vamos a construirlo"
          description="La base de este commit ya deja visible el orden recomendado para no mezclar infraestructura con flujos de negocio."
        />

        <div className="phase-list">
          {buildPhases.map((phase) => (
            <article key={phase.title} className="timeline-card">
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card">
        <PageHeader
          eyebrow="Servicios"
          title="Mapa de microservicios"
          description="Cada integración nace con su URL base y responsabilidad clara dentro del frontend."
        />

        <div className="service-grid">
          {serviceList.map((service) => (
            <article key={service.key} className="service-card">
              <div className="chip-row">
                <ServiceBadge value={service.category} />
                <ServiceBadge value={service.tab} />
              </div>
              <h3>{service.label}</h3>
              <p>{service.description}</p>
              <code>{service.routeBase}</code>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

