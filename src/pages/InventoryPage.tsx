import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ServiceBadge from "../components/ui/ServiceBadge";
import { serviceRegistry } from "../config/service-registry";
import {
  fetchInventoryCollection,
  type CatalogItem,
  type InventoryServiceKey,
} from "../features/catalog/catalog.api";
import { getErrorMessage } from "../lib/http/get-error-message";
import { formatCurrency } from "../lib/formatters";

interface InventoryPageProps {
  heading: string;
  description: string;
  serviceKey: InventoryServiceKey;
  audience: "public" | "private";
}

export default function InventoryPage({
  heading,
  description,
  serviceKey,
  audience,
}: InventoryPageProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const service = serviceRegistry[serviceKey];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const snapshot = await fetchInventoryCollection(serviceKey);
        setItems(snapshot.items);
      } catch (requestError: unknown) {
        setItems([]);
        setError(
          getErrorMessage(
            requestError,
            "No se pudo conectar con el microservicio todavía.",
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [serviceKey]);

  const term = search.trim().toLowerCase();
  const filteredItems = !term
    ? items
    : items.filter((item) =>
        [item.title, item.subtitle, item.badge, ...item.meta]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );

  return (
    <div className="page-stack">
      <section className="surface-card">
        <PageHeader
          eyebrow={audience === "public" ? "Catálogo público" : "Operación interna"}
          title={heading}
          description={description}
        />

        <div className="chip-row">
          <ServiceBadge value={service.label} />
          <ServiceBadge value={service.stack} />
          <ServiceBadge value={service.routeBase} />
        </div>

        <label className="field search-field">
          <span>Buscar dentro del módulo</span>
          <input
            type="search"
            placeholder="Busca por modelo, marca, color o placa"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        {error ? <div className="feedback warning">{error}</div> : null}

        {loading ? (
          <div className="screen-center compact">
            <div className="loading-dot" />
            <p>Cargando datos desde {service.label}...</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <article key={item.id} className="vehicle-card">
                  <div className="vehicle-media">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} />
                    ) : (
                      <div className="vehicle-placeholder">Sin imagen</div>
                    )}
                  </div>

                  <div className="vehicle-body">
                    <div className="chip-row">
                      <ServiceBadge value={item.badge} />
                      <ServiceBadge value={item.source} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                    <ul className="meta-list">
                      {item.meta.map((meta) => (
                        <li key={meta}>{meta}</li>
                      ))}
                    </ul>
                    <strong>{formatCurrency(item.price)}</strong>
                  </div>
                </article>
              ))
            ) : (
              <article className="empty-panel">
                <h3>Sin resultados todavía</h3>
                <p>
                  El módulo está listo, pero no recibió datos del servicio o el
                  filtro actual no encontró coincidencias.
                </p>
              </article>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
