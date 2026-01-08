export function formatHistoryRange(
  from?: string | null,
  to?: string | null,
  ongoingLabel = "(ongoing)"
) {
  const start = from ?? "";
  return to ? `${start} → ${to}` : `${start} → ${ongoingLabel}`;
}
