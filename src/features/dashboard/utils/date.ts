import type { Tenant } from "../../administration/tenants";

export function endOfMonth(year: number, monthIndex0to11: number) {
  return new Date(year, monthIndex0to11 + 1, 0, 23, 59, 59, 999);
}

export function statusOnDate(
  tenant: Tenant,
  at: Date
): "active" | "inactive" | "expired" {
  if (!tenant?.isActive) return "inactive";
  const validUntil = tenant?.validUpToDate
    ? new Date(tenant.validUpToDate)
    : null;
  if (!validUntil) return "inactive";
  return validUntil < at ? "expired" : "active";
}

export function monthIndexFromISO(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d.getMonth() : null;
}

export function toLocal(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d.toLocaleString() : "—";
}
