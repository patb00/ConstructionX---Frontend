export function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function isValidRange(from: string, to: string) {
  if (!from || !to) return false;
  return new Date(from) <= new Date(to);
}

export const formatDate = (d?: string | null) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("hr-HR");
  } catch {
    return String(d);
  }
};
export const formatDateRange = (from?: string | null, to?: string | null) =>
  `${formatDate(from)} — ${formatDate(to)}`;

export const toPickerValue = (value?: string | null): Date | null => {
  if (!value) return null;
  return new Date(value);
};

export const fromPickerValue = (value: Date | null): string =>
  value ? value.toISOString().slice(0, 10) : "";

export function formatFromAssignmentWindows(
  windows?: Array<{
    dateFrom?: string | null;
    dateTo?: string | null;
  }> | null
): string | null {
  if (!windows?.length) return null;

  const parts = windows
    .map((w) => formatDateRange(w?.dateFrom ?? null, w?.dateTo ?? null))
    .filter((x) => x && x !== "—");

  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  return parts.join(" • ");
}

export function getConstructionSiteDateRange(item: {
  dateFrom?: string | null;
  dateTo?: string | null;
  assignmentWindows?: Array<{
    dateFrom?: string | null;
    dateTo?: string | null;
  }> | null;
}): string {
  const fromWindows = formatFromAssignmentWindows(item.assignmentWindows);
  if (fromWindows) return fromWindows;

  return formatDateRange(item.dateFrom ?? null, item.dateTo ?? null);
}
