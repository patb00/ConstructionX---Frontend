import { useAuthStore } from "../features/auth/store/useAuthStore";
import { getCookie, setCookie, deleteCookie } from "./cookie";

const ACCESS_COOKIE = "auth_jwt";
const REFRESH_COOKIE = "auth_rtok";
const REFRESH_EXP_COOKIE = "auth_rtok_exp";
const TENANT_COOKIE = "auth_tenant";

let refreshInFlight: Promise<string | null> | null = null;

function pickMessage(data: any, fallback: string) {
  if (!data) return fallback;
  if (typeof data === "string") return data || fallback;
  return (
    data?.Messages?.[0] ||
    data?.messages?.[0] ||
    data?.Message ||
    data?.message ||
    data?.title ||
    data?.detail ||
    fallback
  );
}

export async function authFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const jwt = getCookie(ACCESS_COOKIE);
  const refreshToken = getCookie(REFRESH_COOKIE);
  const tenant = getCookie(TENANT_COOKIE);

  const headers = new Headers(options.headers || {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  if (tenant) headers.set("tenant", tenant);
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`);

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && refreshToken) {
    if (!refreshInFlight) {
      refreshInFlight = refreshTokens(jwt!, refreshToken);
    }
    const newJwt = await refreshInFlight;

    if (newJwt) {
      const retryHeaders = new Headers(options.headers || {});
      if (!retryHeaders.has("Accept"))
        retryHeaders.set("Accept", "application/json");
      if (!retryHeaders.has("Content-Type"))
        retryHeaders.set("Content-Type", "application/json");
      if (tenant) retryHeaders.set("tenant", tenant);
      retryHeaders.set("Authorization", `Bearer ${newJwt}`);
      res = await fetch(url, { ...options, headers: retryHeaders });
    } else {
      const store = useAuthStore.getState();
      store.clear();
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text || null;
    }

    const msg = pickMessage(data, res.statusText || `HTTP ${res.status}`);
    const error: any = new Error(msg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return (await res.text()) as unknown as T;
}

export async function refreshTokens(
  currentJwt: string,
  currentRefreshToken: string
) {
  try {
    const res = await fetch("/api/Token/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentJwt}`,
      },
      body: JSON.stringify({
        currentJWT: currentJwt,
        currentRefreshToken,
        refreshTokenExpirationDate:
          getCookie(REFRESH_EXP_COOKIE) ?? new Date().toISOString(),
      }),
    });

    const text = await res.text().catch(() => "");
    const json = (() => {
      try {
        return text ? JSON.parse(text) : {};
      } catch {
        return {};
      }
    })();

    if (!res.ok) {
      return null;
    }

    if (!json?.data?.jwt) {
      return null;
    }

    const { jwt, refreshToken, refreshTokenExpirationDate } = json.data;

    setCookie(ACCESS_COOKIE, jwt, { days: 7 });
    setCookie(REFRESH_COOKIE, refreshToken, { days: 30 });
    setCookie(REFRESH_EXP_COOKIE, refreshTokenExpirationDate, { days: 30 });

    const store = useAuthStore.getState();
    store.setTokens(jwt, refreshToken, refreshTokenExpirationDate);

    return jwt;
  } catch (err) {
    deleteCookie(ACCESS_COOKIE);
    deleteCookie(REFRESH_COOKIE);
    deleteCookie(REFRESH_EXP_COOKIE);
    return null;
  } finally {
    refreshInFlight = null;
  }
}
