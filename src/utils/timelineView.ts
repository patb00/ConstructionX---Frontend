export function parseLocalIsoDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function normalizeDate(dateStr: string) {
  const d = parseLocalIsoDate(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysDiffInclusive(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

export function clampDate(d: Date, min: Date, max: Date) {
  if (d < min) return min;
  if (d > max) return max;
  return d;
}

export function overlapsRange(
  itemStart: Date,
  itemEnd: Date,
  rangeStart: Date,
  rangeEnd: Date
) {
  return itemStart <= rangeEnd && itemEnd >= rangeStart;
}

export function dayIndex(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}
