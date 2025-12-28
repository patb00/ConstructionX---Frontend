import { create } from "zustand";
import { deleteCookie, getCookie, setCookie } from "../../../lib/cookie";
import { isExpired, decodeJwt } from "../../../lib/jwt";

const ACCESS_COOKIE = "auth_jwt";
const MCP_COOKIE = "auth_mcp";

export type AuthState = {
  jwt: string | null;
  refreshToken: string | null;
  refreshTokenExpirationDate: string | null;
  isAuthenticated: boolean;
  tenant: string | null;
  role: string | null;
  permissions: string[];
  userId: string | null;
  mustChangePassword: boolean;
  hasHydrated: boolean;

  setTenant: (tenant: string) => void;

  setPermissions: (perms: string[]) => void;

  setRole: (role: string | null) => void;
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
  role: null,
  userId: null,
  mustChangePassword: false,
  hasHydrated: false,

  setTenant: (tenant) => {
    set({ tenant });
  },

  setPermissions: (perms) => set({ permissions: perms ?? [] }),
  setRole: (role) => set({ role: role ?? null }),

  setMustChangePassword: (v) => {
    if (v) setCookie(MCP_COOKIE, "1", { days: 1 });
    else deleteCookie(MCP_COOKIE);
    set({ mustChangePassword: !!v });
  },

  loadFromCookies: () => {
    const jwt = getCookie(ACCESS_COOKIE);
    const mcp = getCookie(MCP_COOKIE);

    let tenant: string | null = null;
    let userId: string | null = null;
    let role: string | null = null;

    if (jwt) {
      const claims = decodeJwt(jwt) as any;

      if (claims) {
        tenant = claims.tenant ?? null;

        role =
          claims?.[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ??
          claims?.["role"] ??
          null;

        userId =
          claims?.[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] ?? null;
      }
    }

    const ok = !!jwt && !isExpired(jwt);

    set({
      jwt: jwt || null,
      refreshToken: null,
      refreshTokenExpirationDate: null,
      tenant,
      permissions: [],
      role,
      userId,
      isAuthenticated: ok,
      mustChangePassword: !!mcp,
      hasHydrated: true,
    });
  },

  setTokens: (jwt, refreshToken, refreshExpISO) => {
    setCookie(ACCESS_COOKIE, jwt, { days: 7 });

    const claims = decodeJwt(jwt) as any;

    const tenant = claims?.tenant ?? null;

    const role =
      claims?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] ??
      claims?.["role"] ??
      null;

    const userId =
      claims?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ?? null;

    set({
      jwt,
      refreshToken,
      refreshTokenExpirationDate: refreshExpISO,
      tenant,
      permissions: [],
      role,
      userId,
      isAuthenticated: !isExpired(jwt),
    });
  },

  clear: () => {
    deleteCookie(ACCESS_COOKIE);
    deleteCookie(MCP_COOKIE);

    set({
      jwt: null,
      refreshToken: null,
      refreshTokenExpirationDate: null,
      tenant: null,
      permissions: [],
      role: null,
      userId: null,
      mustChangePassword: false,
      isAuthenticated: false,
      hasHydrated: true,
    });
  },

  isAccessExpired: () => {
    const jwt = get().jwt || getCookie(ACCESS_COOKIE) || "";
    return jwt ? isExpired(jwt) : true;
  },
}));
