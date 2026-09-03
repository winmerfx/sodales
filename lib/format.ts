/**
 * Money is stored as integer cents everywhere. Format only at the edge — never
 * do arithmetic on a formatted string, and never store a float.
 */
export function formatPrice(cents: number, currency = "USD"): string {
  if (cents === 0) return "Free";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    // $49 rather than $49.00, but $49.50 keeps its cents.
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
