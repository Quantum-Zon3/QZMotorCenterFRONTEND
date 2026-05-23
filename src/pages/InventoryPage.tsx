import { MdSearch } from "react-icons/md";

interface Props {
  heading: string;
  description: string;
  serviceKey: string;
  audience?: string;
}

const emojiMap: Record<string, string> = {
  cars: "🚗",
  motorcycles: "🏍️",
  electrobikes: "⚡",
  scooters: "🛴",
};

const mockItems = [
  { id: 1, name: "Modelo Alpha", sub: "2023 · Disponible", price: "$45.000.000" },
  { id: 2, name: "Modelo Beta", sub: "2022 · Disponible", price: "$38.000.000" },
  { id: 3, name: "Modelo Gamma", sub: "2024 · Próximamente", price: "$62.000.000" },
  { id: 4, name: "Modelo Delta", sub: "2023 · Disponible", price: "$41.000.000" },
];

export default function InventoryPage({ heading, description, serviceKey }: Props) {
  const emoji = emojiMap[serviceKey] ?? "🚗";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>
          {emoji} {heading}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{description}</p>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: "1.75rem" }}>
        <span className="search-bar-icon"><MdSearch /></span>
        <input type="text" placeholder="Buscar en el catálogo..." />
      </div>

      {/* Grid */}
      <div className="catalog-grid">
        {mockItems.map((item) => (
          <div key={item.id} className="catalog-card">
            <div style={{
              height: 120,
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--bg-card-hover), var(--bg-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              marginBottom: "1rem",
            }}>
              {emoji}
            </div>
            <h3 style={{ fontSize: "1rem" }}>{item.name}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.25rem 0 0.75rem" }}>{item.sub}</p>
            <div style={{ fontWeight: 700, color: "var(--success)", fontSize: "1.1rem" }}>{item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}