type EmployeeLike = {
  id?: number | string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export function getEmployeeLabel(e: EmployeeLike | null | undefined): string {
  return [e?.firstName, e?.lastName].filter(Boolean).join(" ") || `#${e?.id}`;
}

export function getEmployeeInitials(e: EmployeeLike | null | undefined): string {
  const first = e?.firstName?.[0] ?? "";
  const last = e?.lastName?.[0] ?? "";
  const initials = `${first}${last}`.trim();
  return initials || (e?.id != null ? String(e.id).slice(-2) : "?");
}
