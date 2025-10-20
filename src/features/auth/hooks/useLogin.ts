import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { login, type LoginBody, type LoginResponse } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";

export function useLogin(
  tenant?: string
): UseMutationResult<LoginResponse, Error, LoginBody> {
  const setTokens = useAuthStore((s) => s.setTokens);
  const setMustChangePassword = useAuthStore((s) => s.setMustChangePassword);
  return useMutation<LoginResponse, Error, LoginBody>({
    mutationFn: (body) => login(body, tenant),
    onSuccess: (data) => {
      if (!data.isSuccessfull)
        throw new Error(data.messages?.[0] || "Login failed");
      const {
        jwt,
        refreshToken,
        refreshTokenExpirationDate,
        mustChangePassword,
      } = data.data;
      setTokens(jwt, refreshToken, refreshTokenExpirationDate);
      setMustChangePassword(!!mustChangePassword);
    },
  });
}
