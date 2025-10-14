import { API_BASE, DEFAULT_TENANT } from "../../../lib/env";

export type LoginBody = { username: string; password: string };
export type LoginResponse = {
  data: {
    jwt: string;
    refreshToken: string;
    refreshTokenExpirationDate: string;
    mustChangePassword: boolean;
  };
  messages: string[];
  isSuccessfull: boolean;
};

export async function login(
  { username, password }: LoginBody,
  tenant = DEFAULT_TENANT
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/Token/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      tenant: tenant,
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status})`);
  return res.json();
}

export type RefreshBody = {
  currentJWT: string;
  currentRefreshToken: string;
  refreshTokenExpirationDate: string; // ISO
};

export type RefreshResponse = {
  data?: {
    jwt: string;
    refreshToken: string;
    refreshTokenExpirationDate: string;
  };
  messages?: string[];
  isSuccessfull: boolean;
};

export async function refreshToken(
  authJwt: string,
  body: RefreshBody
): Promise<RefreshResponse> {
  const res = await fetch(`${API_BASE}/api/Token/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${authJwt}`,
    },
    body: JSON.stringify(body),
  });

  // Some servers return 200 + error object; we surface both cases
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json?.Messages?.[0] ||
      json?.messages?.[0] ||
      `Refresh failed (${res.status})`;
    throw new Error(msg);
  }
  return json as RefreshResponse;
}
