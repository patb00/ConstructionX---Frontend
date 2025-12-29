import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { login, type LoginBody, type LoginResponse } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";

export function useLogin(
  tenant?: string
): UseMutationResult<LoginResponse, Error, LoginBody> {
  const { setTokens, setMustChangePassword } = useAuthStore();

  return useMutation<LoginResponse, Error, LoginBody>({
    mutationFn: (body) => {
      const t = (tenant ?? "").trim();
      if (!t) throw new Error("Tenant is required");
      return login(body, t);
    },

    onSuccess: async (data) => {
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
