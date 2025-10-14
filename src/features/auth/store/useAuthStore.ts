import { create } from "zustand";
import { deleteCookie, getCookie, setCookie } from "../../../lib/cookie";
import { isExpired, decodeJwt } from "../../../lib/jwt";

const ACCESS_COOKIE = "auth_jwt";
const REFRESH_COOKIE = "auth_rtok";
const REFRESH_EXP_COOKIE = "auth_rtok_exp";
const TENANT_COOKIE = "auth_tenant";

export type AuthState = {
  jwt: string | null;
  refreshToken: string | null;
  refreshTokenExpirationDate: string | null;
  isAuthenticated: boolean;
  tenant: string | null;
  permissions: string[];
  hasHydrated: boolean; // 👈 NEW
  setTenant: (tenant: string) => void;
  setPermissions: (perms: string[]) => void;
  loadFromCookies: () => void;
  setTokens: (jwt: string, refreshToken: string, refreshExpISO: string) => void;
  clear: () => void;
  isAccessExpired: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  jwt: null,
  refreshToken: null,
  refreshTokenExpirationDate: null,
  isAuthenticated: false,
  tenant: null,
  permissions: [],
  hasHydrated: false,
  setTenant: (tenant) => {
    console.log("[authStore] 🏢 Tenant set to:", tenant);
    setCookie(TENANT_COOKIE, tenant, { days: 30 });
    set({ tenant });
  },

  setPermissions: (perms) => {
    set({ permissions: perms ?? [] });
  },

  loadFromCookies: () => {
    const jwt = getCookie(ACCESS_COOKIE);
    const rt = getCookie(REFRESH_COOKIE);
    const exp = getCookie(REFRESH_EXP_COOKIE);
    const tenantCookie = getCookie(TENANT_COOKIE);

    let tenant = tenantCookie || null;
    let permissions: string[] = [];

    if (jwt) {
      const claims = decodeJwt(jwt) as any;
      if (claims) {
        tenant = tenant ?? claims.tenant ?? null;
        if (Array.isArray(claims.permission)) {
          permissions = claims.permission;
        }
      }
    }

    const ok = !!jwt && !isExpired(jwt); // 👈 consider expiry

    set({
      jwt: jwt || null,
      refreshToken: rt || null,
      refreshTokenExpirationDate: exp || null,
      tenant,
      permissions,
      isAuthenticated: ok,
      hasHydrated: true, // 👈 signal done
    });
  },

  setTokens: (jwt, refreshToken, refreshExpISO) => {
    setCookie(ACCESS_COOKIE, jwt, { days: 7 });
    setCookie(REFRESH_COOKIE, refreshToken, { days: 30 });
    setCookie(REFRESH_EXP_COOKIE, refreshExpISO, { days: 30 });

    const claims = decodeJwt(jwt) as any;
    const perms = Array.isArray(claims?.permission) ? claims.permission : [];

    set({
      jwt,
      refreshToken,
      refreshTokenExpirationDate: refreshExpISO,
      permissions: perms,
      isAuthenticated: !isExpired(jwt), // 👈 consider expiry
    });
  },

  clear: () => {
    deleteCookie(ACCESS_COOKIE);
    deleteCookie(REFRESH_COOKIE);
    deleteCookie(REFRESH_EXP_COOKIE);
    deleteCookie(TENANT_COOKIE);
    set({
      jwt: null,
      refreshToken: null,
      refreshTokenExpirationDate: null,
      tenant: null,
      permissions: [],
      isAuthenticated: false,
    });
  },

  isAccessExpired: () => {
    const jwt = get().jwt || getCookie(ACCESS_COOKIE) || "";
    return jwt ? isExpired(jwt) : true;
  },
}));
