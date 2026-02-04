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

export function toTimeSpanStrict(value: string): string {
  const v = (value ?? "").trim();
  if (!v) return v;

  if (/^\d{1,2}:\d{2}$/.test(v)) {
    const [h, m] = v.split(":");
    return `${h.padStart(2, "0")}:${m}:00`;
  }

  if (/^\d{1,2}:\d{2}:\d{2}$/.test(v)) {
    const [h, m, s] = v.split(":");
    return `${h.padStart(2, "0")}:${m}:${s}`;
  }

  return v;
}

export function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}
