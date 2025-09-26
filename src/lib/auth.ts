import { env } from "../config/env";

type Tokens = {
  jwt: string;
  refreshToken: string;
  refreshTokenExpirationDate?: string;
};

let tokens: Tokens | null = null;
let tenantName: string | null = null;

const KEY_TOKENS = "auth_tokens";
const KEY_TENANT = "tenant_name";

export function setTenant(name: string) {
  tenantName = name;
  sessionStorage.setItem(KEY_TENANT, name);
}
export function getTenant() {
  return tenantName ?? sessionStorage.getItem(KEY_TENANT);
}

export function setTokens(next: Tokens | null) {
  if (env.authMode === "cookie") return;
  tokens = next;
  if (next) sessionStorage.setItem(KEY_TOKENS, JSON.stringify(next));
  else sessionStorage.removeItem(KEY_TOKENS);
}
export function getTokens(): Tokens | null {
  if (env.authMode === "cookie") return null;
  if (tokens) return tokens;
  const raw = sessionStorage.getItem(KEY_TOKENS);
  if (!raw) return null;
  try {
    tokens = JSON.parse(raw) as Tokens;
  } catch {
    tokens = null;
  }
  return tokens;
}

export const getAccessToken = () =>
  env.authMode === "cookie" ? null : getTokens()?.jwt ?? null;
export const getRefreshToken = () =>
  env.authMode === "cookie" ? null : getTokens()?.refreshToken ?? null;

export function isAuthed(): boolean {
  if (env.authMode === "cookie") {
    return true;
  }
  return Boolean(getTokens()?.jwt);
}

export function clearTokens() {
  tokens = null;
  sessionStorage.removeItem(KEY_TOKENS);
}

export function logout() {
  clearTokens();
  tenantName = null;
  sessionStorage.removeItem(KEY_TENANT);
}
