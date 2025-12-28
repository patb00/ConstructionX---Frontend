import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { login, type LoginBody, type LoginResponse } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { UsersApi } from "../../administration/users/api/users.api";
import { usersKeys } from "../../administration/users/api/users.keys";

export function useLogin(
  tenant?: string
): UseMutationResult<LoginResponse, Error, LoginBody> {
  const qc = useQueryClient();

  const { setTokens, setMustChangePassword, setPermissions } = useAuthStore();

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

      const permsRes = await UsersApi.getMyPermissions();

      const perms = Array.isArray(permsRes) ? permsRes : [];

      setPermissions(perms);

      qc.setQueryData(usersKeys.mePermissions(), permsRes);
    },
  });
}
