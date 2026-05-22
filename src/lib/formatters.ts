export const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const compactFormatter = new Intl.NumberFormat("es-CO", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatCurrency = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value)
    ? currencyFormatter.format(value)
    : "Sin precio";

export const formatCompact = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value)
    ? compactFormatter.format(value)
    : "0";

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
};

export const clampText = (value: string, length = 120) =>
  value.length > length ? `${value.slice(0, length - 1)}…` : value;

