import { env } from "../../../config/env";
import { setTokens } from "../../../lib/auth";
import { httpPost } from "../../../lib/http";
import type { LoginRequest, TokenResponse, ApiResponse } from "../types";

export async function login(
  body: LoginRequest
): Promise<ApiResponse<TokenResponse>> {
  const res = await httpPost<ApiResponse<TokenResponse>>(
    "/api/Token/login",
    body
  );

  if (env.authMode === "header") {
    setTokens(res.data);
  }

  return res;
}
