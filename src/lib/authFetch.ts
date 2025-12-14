import { useAuthStore } from "../features/auth/store/useAuthStore";
import { getCookie, setCookie, deleteCookie } from "./cookie";
import { getTenantFromJwt } from "./jwt";

const ACCESS_COOKIE = "auth_jwt";

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
  const refreshToken = useAuthStore.getState().refreshToken;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const tenant = getTenantFromJwt(jwt);
  if (tenant) headers.set("tenant", tenant);
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`);

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && refreshToken && jwt) {
    if (!refreshInFlight) {
      refreshInFlight = refreshTokens(jwt, refreshToken);
    }
    const newJwt = await refreshInFlight;

    if (newJwt) {
      const retryHeaders = new Headers(options.headers || {});
      if (!retryHeaders.has("Accept")) {
        retryHeaders.set("Accept", "application/json");
      }

      const isRetryFormData = options.body instanceof FormData;
      if (!isRetryFormData && !retryHeaders.has("Content-Type")) {
        retryHeaders.set("Content-Type", "application/json");
      }

      const retryTenant = getTenantFromJwt(newJwt);
      if (retryTenant) retryHeaders.set("tenant", retryTenant);

      retryHeaders.set("Authorization", `Bearer ${newJwt}`);

      res = await fetch(url, { ...options, headers: retryHeaders });
    } else {
      useAuthStore.getState().clear();
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

export async function authFetchBlob(
  url: string,
  options: RequestInit = {}
): Promise<Blob> {
  const jwt = getCookie(ACCESS_COOKIE);
  const refreshToken = useAuthStore.getState().refreshToken;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/octet-stream");
  }

  const tenant = getTenantFromJwt(jwt);
  if (tenant) headers.set("tenant", tenant);
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`);

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && refreshToken && jwt) {
    if (!refreshInFlight) {
      refreshInFlight = refreshTokens(jwt, refreshToken);
    }
    const newJwt = await refreshInFlight;

    if (newJwt) {
      const retryHeaders = new Headers(options.headers || {});
      if (!retryHeaders.has("Accept")) {
        retryHeaders.set("Accept", "application/octet-stream");
      }

      const retryTenant = getTenantFromJwt(newJwt);
      if (retryTenant) retryHeaders.set("tenant", retryTenant);

      retryHeaders.set("Authorization", `Bearer ${newJwt}`);

      res = await fetch(url, { ...options, headers: retryHeaders });
    } else {
      useAuthStore.getState().clear();
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

  return res.blob();
}

export async function refreshTokens(
  currentJwt: string,
  currentRefreshToken: string
) {
  try {
    const refreshTokenExpirationDate =
      useAuthStore.getState().refreshTokenExpirationDate ??
      new Date().toISOString();

    const res = await fetch("/api/Token/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentJwt}`,
      },
      body: JSON.stringify({
        currentJWT: currentJwt,
        currentRefreshToken,
        refreshTokenExpirationDate,
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

    if (!res.ok) return null;
    if (!json?.data?.jwt) return null;

    const { jwt, refreshToken, refreshTokenExpirationDate: newExp } = json.data;

    // only persist access token
    setCookie(ACCESS_COOKIE, jwt, { days: 7 });

    useAuthStore.getState().setTokens(jwt, refreshToken, newExp);
    return jwt;
  } catch {
    deleteCookie(ACCESS_COOKIE);
    useAuthStore.getState().clear();
    return null;
  } finally {
    refreshInFlight = null;
  }
}
