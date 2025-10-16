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
