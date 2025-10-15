// store/useAuthStore.ts
import { create } from "zustand";
import { deleteCookie, getCookie, setCookie } from "../../../lib/cookie";
import { isExpired, decodeJwt } from "../../../lib/jwt";

const ACCESS_COOKIE = "auth_jwt";
const REFRESH_COOKIE = "auth_rtok";
const REFRESH_EXP_COOKIE = "auth_rtok_exp";
const TENANT_COOKIE = "auth_tenant";
const MCP_COOKIE = "auth_mcp"; // NEW

export type AuthState = {
  jwt: string | null;
  refreshToken: string | null;
  refreshTokenExpirationDate: string | null;
  isAuthenticated: boolean;
  tenant: string | null;
  permissions: string[];
  userId: string | null;
  mustChangePassword: boolean;
  hasHydrated: boolean;
  setTenant: (tenant: string) => void;
  setPermissions: (perms: string[]) => void;
  setMustChangePassword: (v: boolean) => void;
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
  userId: null,
  mustChangePassword: false,
  hasHydrated: false,

  setTenant: (tenant) => {
    setCookie(TENANT_COOKIE, tenant, { days: 30 });
    set({ tenant });
  },

  setPermissions: (perms) => set({ permissions: perms ?? [] }),

  // ⬇️ persist + clear cookie alongside the store flag
  setMustChangePassword: (v) => {
    if (v) setCookie(MCP_COOKIE, "1", { days: 1 }); // short-lived is fine
    else deleteCookie(MCP_COOKIE);
    set({ mustChangePassword: !!v });
  },

  loadFromCookies: () => {
    const jwt = getCookie(ACCESS_COOKIE);
    const rt = getCookie(REFRESH_COOKIE);
    const exp = getCookie(REFRESH_EXP_COOKIE);
    const tenantCookie = getCookie(TENANT_COOKIE);
    const mcp = getCookie(MCP_COOKIE); // NEW

    let tenant = tenantCookie || null;
    let permissions: string[] = [];
    let userId: string | null = null;

    if (jwt) {
      const claims = decodeJwt(jwt) as any;
      if (claims) {
        tenant = tenant ?? claims.tenant ?? null;
        if (Array.isArray(claims.permission)) permissions = claims.permission;
        userId =
          claims[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] ?? null;
      }
    }

    const ok = !!jwt && !isExpired(jwt);

    set({
      jwt: jwt || null,
      refreshToken: rt || null,
      refreshTokenExpirationDate: exp || null,
      tenant,
      permissions,
      userId,
      isAuthenticated: ok,
      mustChangePassword: !!mcp, // NEW -> restore flag on refresh
      hasHydrated: true,
    });
  },

  setTokens: (jwt, refreshToken, refreshExpISO) => {
    setCookie(ACCESS_COOKIE, jwt, { days: 7 });
    setCookie(REFRESH_COOKIE, refreshToken, { days: 30 });
    setCookie(REFRESH_EXP_COOKIE, refreshExpISO, { days: 30 });

    const claims = decodeJwt(jwt) as any;
    const perms = Array.isArray(claims?.permission) ? claims.permission : [];
    const userId =
      claims?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ?? null;

    set({
      jwt,
      refreshToken,
      refreshTokenExpirationDate: refreshExpISO,
      permissions: perms,
      userId,
      isAuthenticated: !isExpired(jwt),
    });
  },

  clear: () => {
    deleteCookie(ACCESS_COOKIE);
    deleteCookie(REFRESH_COOKIE);
    deleteCookie(REFRESH_EXP_COOKIE);
    deleteCookie(TENANT_COOKIE);
    deleteCookie(MCP_COOKIE); // NEW
    set({
      jwt: null,
      refreshToken: null,
      refreshTokenExpirationDate: null,
      tenant: null,
      permissions: [],
      userId: null,
      mustChangePassword: false,
      isAuthenticated: false,
    });
  },

  isAccessExpired: () => {
    const jwt = get().jwt || getCookie(ACCESS_COOKIE) || "";
    return jwt ? isExpired(jwt) : true;
  },
}));
