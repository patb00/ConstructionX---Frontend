export function formatDateTime(iso?: string | null) {
  if (!iso) return "";
  return iso.replace("T", " ").slice(0, 16);
}
