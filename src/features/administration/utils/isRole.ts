import type { Role } from "../roles";

export function isRole(x: any): x is Role {
  return x && typeof x.id === "string";
}
