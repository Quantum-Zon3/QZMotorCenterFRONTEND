interface ServiceBadgeProps {
  value: string;
}

export default function ServiceBadge({ value }: ServiceBadgeProps) {
  return <span className="chip">{value}</span>;
}

