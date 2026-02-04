export function makeHeaderFormatter(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

export function makeTooltipFormatter(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function makeWeekRangeFormatter(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function safeFormatISO(iso: string, fmt: Intl.DateTimeFormat): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : fmt.format(d);
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatWeekRange(weekStart: Date, fmt: Intl.DateTimeFormat) {
  const end = addDays(weekStart, 6);
  return `${fmt.format(weekStart)} – ${fmt.format(end)}`;
}

export function formatLocalIsoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatRangeWithOngoingLabel(
  from?: string | null,
  to?: string | null,
  ongoingLabel = "(ongoing)"
) {
  const f = from ?? "";
  return to ? `${f} → ${to}` : `${f} → ${ongoingLabel}`;
}
