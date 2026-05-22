interface StatCardProps {
  label: string;
  value: string;
  detail: string;
}

export default function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="stat-card">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

