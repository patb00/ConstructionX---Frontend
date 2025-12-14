const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
  tenant: string
): Promise<LoginResponse> {
  const t = (tenant ?? "").trim();
  if (!t) throw new Error("Tenant is required");

  const res = await fetch(`${API_BASE}/api/Token/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      tenant: t,
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.Messages?.[0] ||
      data?.messages?.[0] ||
      `Login failed (${res.status})`;
    throw new Error(message);
  }

  return {
    data: data.data ?? data.Data,
    messages: data.messages ?? data.Messages ?? [],
    isSuccessfull: data.isSuccessfull ?? data.IsSuccessfull ?? false,
  };
}
export type RefreshBody = {
  currentJWT: string;
  currentRefreshToken: string;
  refreshTokenExpirationDate: string;
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
