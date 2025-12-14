export type JwtClaims = {
  exp?: number;
  [key: string]: any;
};

export function decodeJwt(token: string): JwtClaims | null {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function isExpired(token: string, skewSeconds = 15): boolean {
  const claims = decodeJwt(token);
  if (!claims?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return now >= claims.exp - skewSeconds;
}

export function getTenantFromJwt(jwt: string | null): string | null {
  if (!jwt) return null;
  const claims = decodeJwt(jwt);
  const t = (claims?.tenant ?? "").toString().trim();
  return t || null;
}
