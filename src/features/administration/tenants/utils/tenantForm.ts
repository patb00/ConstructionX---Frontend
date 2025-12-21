import type { Tenant, UpdateTenantRequest } from "..";
import type { TenantFormValues } from "../components/TenantForm";

export type TenantSubscriptionFormValues = {
  validUpToDate: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function isoToLocalInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function localInputToIso(local: string): string {
  return new Date(local).toISOString();
}

export function tenantToSubscriptionDefaults(
  tenant: Tenant | null | undefined
): TenantSubscriptionFormValues | undefined {
  if (!tenant) return undefined;
  return {
    validUpToDate: isoToLocalInput(tenant.validUpToDate ?? null),
  };
}

export function tenantToEditDefaults(
  tenant: Tenant | null | undefined
): Partial<TenantFormValues<"edit">> | undefined {
  if (!tenant) return undefined;

  return {
    email: tenant.email ?? "",
    firstName: tenant.firstName ?? "",
    lastName: tenant.lastName ?? "",
    oib: tenant.oib ?? "",
    vatNumber: tenant.vatNumber ?? "",
    registrationNumber: tenant.registrationNumber ?? "",
    companyCode: tenant.companyCode ?? "",
    contactPhone: tenant.contactPhone ?? "",
    websiteUrl: tenant.websiteUrl ?? "",
    addressStreet: tenant.addressStreet ?? "",
    addressPostalCode: tenant.addressPostalCode ?? "",
    addressCity: tenant.addressCity ?? "",
    addressState: tenant.addressState ?? "",
    addressCountry: tenant.addressCountry ?? "",
    defaultLanguage: tenant.defaultLanguage ?? "en",
    notes: tenant.notes ?? "",
  };
}

export function buildUpdateTenantPayload(
  tenantId: string,
  values: TenantFormValues<"edit">
): { tenantId: string; payload: UpdateTenantRequest } {
  return {
    tenantId,
    payload: {
      id: tenantId,
      ...values,
    },
  };
}

export function normalizeBackslashes(s: string) {
  return s.replace(/\\+/g, "\\");
}

export function sanitizeConnectionString(s?: string | null): string | null {
  const trimmed = (s ?? "").trim();
  if (!trimmed) return null;
  return normalizeBackslashes(trimmed);
}

export function extractTenantIdFromCreateResult(
  result: unknown
): string | undefined {
  const r = result as any;
  return r?.data ?? r?.tenantId;
}
