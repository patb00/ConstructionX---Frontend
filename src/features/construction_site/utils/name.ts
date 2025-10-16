export function normalizeName(s: string) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
export function fullName(first?: string, last?: string) {
  return normalizeName(`${first ?? ""} ${last ?? ""}`);
}
