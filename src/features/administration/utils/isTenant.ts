import type { Tenant } from "../tenants";

export function isTenant(x: any): x is Tenant {
  return x && typeof x.identifier === "string";
}
