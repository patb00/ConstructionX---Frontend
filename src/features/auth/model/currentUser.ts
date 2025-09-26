import { getTokens } from "../../../lib/auth";
import { decodeJwt } from "../../../lib/jwt";

const CLAIMS = {
  NAME_ID:
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  EMAIL: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  NAME: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  SURNAME: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
  ROLE: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
} as const;

export type CurrentUser = {
  id?: string;
  email?: string;
  name?: string;
  surname?: string;
  role?: string;
  tenant?: string;
  permissions?: string[];
  exp?: number;
};

export function getCurrentUser(): CurrentUser | null {
  const tokens = getTokens();
  const jwt = tokens?.jwt;
  if (!jwt) return null;

  const p = decodeJwt<Record<string, any>>(jwt);
  if (!p) return null;

  const role =
    p[CLAIMS.ROLE] ||
    p.role ||
    (Array.isArray(p.roles) ? p.roles[0] : undefined);

  return {
    id: p[CLAIMS.NAME_ID],
    email: p[CLAIMS.EMAIL],
    name: p[CLAIMS.NAME],
    surname: p[CLAIMS.SURNAME],
    role,
    tenant: p.tenant,
    permissions: p.permission,
    exp: p.exp,
  };
}
