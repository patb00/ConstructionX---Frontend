import { env } from "../config/env";
import {
  getAccessToken,
  getRefreshToken,
  getTokens,
  setTokens,
  getTenant,
} from "./auth";
import { refreshToken as refreshCall } from "../features/auth/api/refreshToken";

export type HttpOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  responseType?: "json" | "text" | "auto";
  signal?: AbortSignal;
  credentials?: RequestCredentials; // only needed if you later use cookie auth
};

let refreshInFlight: Promise<string | null> | null = null;

async function parseResponse(
  res: Response,
  kind: HttpOptions["responseType"] = "auto"
) {
  // No content
  if (res.status === 204) return null;

  if (kind === "text") return res.text();
  if (kind === "json") return res.json();

  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    return res.json();
  }

  const txt = await res.text();
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

export async function http<T = any>(
  path: string,
  opts: HttpOptions = {}
): Promise<T> {
  // Absolute URLs pass through; otherwise prefix base ("" in dev so Vite proxy catches /api)
  const url = /^https?:\/\//i.test(path)
    ? path
    : `${env.apiBaseUrl ?? ""}${path}`;

  const headers: Record<string, string> = {
    Accept: "*/*",
    "Content-Type": "application/json",
    ...opts.headers,
  };

  // Required custom tenant header
  const tenant = getTenant();
  if (tenant) headers["tenant"] = tenant;

  // Attach bearer only in header mode
  if (env.authMode === "header") {
    const jwt = getAccessToken();
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  }

  const init: RequestInit = {
    method: opts.method ?? "GET",
    headers,
    body:
      opts.body === undefined || opts.body === null
        ? undefined
        : typeof opts.body === "string"
        ? opts.body
        : JSON.stringify(opts.body),
    signal: opts.signal,
    // In cookie mode, include credentials so cookies are sent
    credentials: env.authMode === "cookie" ? "include" : opts.credentials,
  };

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (e) {
    const err = new Error("Network error");
    (err as any).cause = e;
    throw err;
  }

  if (res.status === 401 && env.authMode === "header") {
    if (!refreshInFlight) {
      refreshInFlight = (async () => {
        const rt = getRefreshToken();
        if (!rt || !getTokens()?.jwt) return null;
        try {
          const refreshed = await refreshCall();
          if (!refreshed) {
            setTokens(null);
            return null; // cookie mode or refresh failed
          }
          return refreshed.jwt;
        } catch {
          setTokens(null); // drop invalid tokens
          return null;
        } finally {
          setTimeout(() => {
            refreshInFlight = null;
          }, 0);
        }
      })();
    }

    const newToken = await refreshInFlight;
    if (newToken) {
      const retriedHeaders = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };
      try {
        res = await fetch(url, { ...init, headers: retriedHeaders });
      } catch (e) {
        const err = new Error("Network error");
        (err as any).cause = e;
        throw err;
      }
    }
  }

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await parseResponse(res, opts.responseType ?? "auto");
    } catch {}
    const err = new Error(`HTTP ${res.status}`);
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }

  return parseResponse(res, opts.responseType ?? "auto") as Promise<T>;
}

export const httpGet = <T = any>(
  p: string,
  o?: Omit<HttpOptions, "method" | "body">
) => http<T>(p, { ...o, method: "GET" });

export const httpPost = <T = any>(
  p: string,
  b?: unknown,
  o?: Omit<HttpOptions, "method">
) => http<T>(p, { ...o, method: "POST", body: b });

export const httpPut = <T = any>(
  p: string,
  b?: unknown,
  o?: Omit<HttpOptions, "method">
) => http<T>(p, { ...o, method: "PUT", body: b });

export const httpPatch = <T = any>(
  p: string,
  b?: unknown,
  o?: Omit<HttpOptions, "method">
) => http<T>(p, { ...o, method: "PATCH", body: b });

export const httpDelete = <T = any>(
  p: string,
  o?: Omit<HttpOptions, "method" | "body">
) => http<T>(p, { ...o, method: "DELETE" });
