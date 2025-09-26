import { httpPost } from "../../../lib/http";
import { getTokens, setTokens } from "../../../lib/auth";
import { env } from "../../../config/env";
import type { ApiResponse, TokenResponse } from "../types";

export async function refreshToken(): Promise<ApiResponse<TokenResponse>> {
  if (env.authMode === "cookie") {
    const res = await httpPost<ApiResponse<TokenResponse>>(
      "/api/Token/refresh-token"
    );
    return res;
  }

  const current = getTokens();
  if (!current) throw new Error("No tokens to refresh");

  const res = await httpPost<ApiResponse<TokenResponse>>(
    "/api/Token/refresh-token",
    {
      currentJWT: current.jwt,
      currentRefreshToken: current.refreshToken,
      refreshTokenExpirationDate: current.refreshTokenExpirationDate,
    }
  );

  setTokens(res.data);
  return res;
}
