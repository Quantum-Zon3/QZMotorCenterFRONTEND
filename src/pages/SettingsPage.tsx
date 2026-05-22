import PageHeader from "../components/ui/PageHeader";
import { env } from "../config/env";
import { serviceList } from "../config/service-registry";

const environmentPairs = Object.entries(env);

export default function SettingsPage() {
  return (
    <div className="page-stack">
      <section className="surface-card">
        <PageHeader
          eyebrow="Configuración"
          title="Variables y despliegue"
          description="Este módulo documenta el contrato mínimo que necesitaremos para desarrollo local, Docker y publicación."
        />

        <div className="data-grid">
          {environmentPairs.map(([key, value]) => (
            <article key={key} className="info-card">
              <h3>{key}</h3>
              <code>{value}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card">
        <PageHeader
          eyebrow="Checklist"
          title="Qué debe existir antes del despliegue"
          description="Estas son las piezas que van a gobernar la publicación del frontend en contenedor."
        />

        <div className="feature-grid">
          <article className="info-card">
            <h3>Entornos consistentes</h3>
            <p>Definir URLs reales por ambiente para los 8 servicios sin dejar endpoints quemados.</p>
          </article>
          <article className="info-card">
            <h3>Autenticación conectada</h3>
            <p>Confirmar que Auth entrega sesión funcional para panel interno y permisos futuros.</p>
          </article>
          <article className="info-card">
            <h3>Docker estable</h3>
            <p>Construir imagen final del SPA y servirlo con Nginx usando fallback para rutas de React.</p>
          </article>
          <article className="info-card">
            <h3>Observabilidad básica</h3>
            <p>Validar health-checks, errores de API y estados vacíos amigables en producción.</p>
          </article>
        </div>

        <div className="surface-subcard">
          <h3>Servicios que esperan configuración</h3>
          <ul className="meta-list">
            {serviceList.map((service) => (
              <li key={service.key}>
                {service.label}: <code>{service.baseUrl}</code>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

