import { useAuthStore } from "../features/auth/store/useAuthStore";
import { getCookie, setCookie, deleteCookie } from "./cookie";

const ACCESS_COOKIE = "auth_jwt";
const REFRESH_COOKIE = "auth_rtok";
const REFRESH_EXP_COOKIE = "auth_rtok_exp";
const TENANT_COOKIE = "auth_tenant";

let refreshInFlight: Promise<string | null> | null = null;

export async function authFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const jwt = getCookie(ACCESS_COOKIE);
  const refreshToken = getCookie(REFRESH_COOKIE);
  const tenant = getCookie(TENANT_COOKIE);

  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  if (tenant) headers.set("tenant", tenant);
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`);

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && refreshToken) {
    console.warn("[authFetch] 401 detected, attempting refresh…");

    if (!refreshInFlight) {
      refreshInFlight = refreshTokens(jwt!, refreshToken);
    }

    const newJwt = await refreshInFlight;

    if (newJwt) {
      console.log("[authFetch] ✅ Token refreshed, retrying original request…");
      const retryHeaders = new Headers(options.headers || {});
      retryHeaders.set("Accept", "application/json");
      retryHeaders.set("Content-Type", "application/json");
      retryHeaders.set("tenant", tenant ?? "");
      retryHeaders.set("Authorization", `Bearer ${newJwt}`);

      res = await fetch(url, { ...options, headers: retryHeaders });
    } else {
      console.error("[authFetch] ❌ Refresh failed, logging out…");
      const store = useAuthStore.getState();
      store.clear();
      throw new Error("Unauthorized — refresh token invalid.");
    }
  }

  if (!res.ok) {
    const text = await res.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    const error = new Error(`HTTP ${res.status}`);
    (error as any).body = body;
    throw error;
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return res.text() as unknown as T;
}

async function refreshTokens(currentJwt: string, currentRefreshToken: string) {
  try {
    console.log("[authFetch] 🔁 Refreshing token…");
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

    if (!res.ok) {
      console.error("[authFetch] Refresh request failed:", res.status);
      return null;
    }

    const data = await res.json();

    if (!data?.data?.jwt) {
      console.error("[authFetch] Invalid refresh response:", data);
      return null;
    }

    const { jwt, refreshToken, refreshTokenExpirationDate } = data.data;

    setCookie(ACCESS_COOKIE, jwt, { days: 7 });
    setCookie(REFRESH_COOKIE, refreshToken, { days: 30 });
    setCookie(REFRESH_EXP_COOKIE, refreshTokenExpirationDate, { days: 30 });

    const store = useAuthStore.getState();
    store.setTokens(jwt, refreshToken, refreshTokenExpirationDate);

    console.log("[authFetch] ✅ Tokens refreshed successfully");
    return jwt;
  } catch (err) {
    console.error("[authFetch] ⚠️ Refresh error:", err);
    deleteCookie(ACCESS_COOKIE);
    deleteCookie(REFRESH_COOKIE);
    deleteCookie(REFRESH_EXP_COOKIE);
    return null;
  } finally {
    refreshInFlight = null;
  }
}
