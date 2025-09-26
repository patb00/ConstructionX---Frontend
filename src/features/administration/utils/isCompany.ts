import type { Company } from "../companies";

export function isCompany(x: any): x is Company {
  return x && (typeof x.id === "number" || typeof x.id === "string");
}
