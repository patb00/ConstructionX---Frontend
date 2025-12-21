export function formatIsoDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function renderDateRange(from: string, to: string): string {
  if (from === "—" && to === "—") return "—";
  if (from === "—") return to;
  if (to === "—") return from;
  if (from === to) return from;
  return `${from} – ${to}`;
}

export function renderIsoDateRange(
  fromIso?: string | null,
  toIso?: string | null
): string {
  const from = formatIsoDate(fromIso);
  const to = formatIsoDate(toIso);
  return renderDateRange(from, to);
}
