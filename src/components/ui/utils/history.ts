export function safeDateOnly(d?: string) {
  if (!d) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const da = Number(m[3]);
    const dt = new Date(y, mo, da);
    return isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

export function formatDateLabel(d?: string) {
  const dt = safeDateOnly(d);
  if (!dt) return "";
  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
