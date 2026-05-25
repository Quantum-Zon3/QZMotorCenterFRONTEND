import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import {
  fetchInventoryCollection,
  type CatalogItem,
  type InventoryServiceKey,
} from "../features/catalog/catalog.api";
import { formatCurrency } from "../lib/formatters";
import { getErrorMessage } from "../lib/http/get-error-message";

interface Props {
  heading: string;
  description: string;
  serviceKey: string;
  audience?: string;
}

const labelMap: Record<string, string> = {
  cars: "Auto",
  motorcycles: "Moto",
  electrobikes: "Electrobike",
  scooters: "Scooter",
};

const isInventoryServiceKey = (value: string): value is InventoryServiceKey =>
  ["cars", "motorcycles", "electrobikes", "scooters"].includes(value);

export default function InventoryPage({ heading, description, serviceKey }: Props) {
  const label = labelMap[serviceKey] ?? "Vehiculo";
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCollection = async () => {
      if (!isInventoryServiceKey(serviceKey)) {
        setItems([]);
        setError("Servicio de inventario no configurado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = await fetchInventoryCollection(serviceKey);
        setItems(data.items);
      } catch (e) {
        setError(getErrorMessage(e, "No se pudo cargar el inventario desde el gateway."));
      } finally {
        setLoading(false);
      }
    };

    void loadCollection();
  }, [serviceKey]);

  const filtered = items.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.subtitle.toLowerCase().includes(term) ||
      item.badge.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>{heading}</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{description}</p>
      </div>

      <div className="search-bar" style={{ marginBottom: "1.75rem" }}>
        <span className="search-bar-icon"><MdSearch /></span>
        <input
          type="text"
          placeholder="Buscar en el catalogo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="login-error" style={{ marginBottom: "1rem" }}>{error}</div>}

      <div className="catalog-grid">
        {loading ? (
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            <p>Cargando inventario real...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            <h3>Sin resultados</h3>
            <p>{items.length === 0 ? "No hay registros en este servicio." : "No se encontraron elementos con ese criterio."}</p>
          </div>
        ) : filtered.map((item) => (
          <div key={item.id} className="catalog-card">
            <div style={{
              height: 120,
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--bg-card-hover), var(--bg-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              overflow: "hidden",
            }}>
              {item.imageUrl
                ? <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-muted)" }}>{label}</span>}
            </div>
            <h3 style={{ fontSize: "1rem" }}>{item.title}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.25rem 0 0.75rem" }}>{item.subtitle}</p>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.65rem" }}>
              {[item.badge, ...item.meta].join(" · ")}
            </div>
            <div style={{ fontWeight: 700, color: "var(--success)", fontSize: "1.1rem" }}>{formatCurrency(item.price)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
