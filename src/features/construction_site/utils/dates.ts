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
