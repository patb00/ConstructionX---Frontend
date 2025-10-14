import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { refreshToken } from "../api/authApi";

export function useRefreshToken() {
  const {
    jwt,
    refreshToken: rt,
    refreshTokenExpirationDate,
    setTokens,
    clear,
  } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (!jwt || !rt || !refreshTokenExpirationDate)
        throw new Error("No tokens");
      const res = await refreshToken(jwt, {
        currentJWT: jwt,
        currentRefreshToken: rt,
        refreshTokenExpirationDate,
      });
      if (!res.isSuccessfull || !res.data)
        throw new Error(res?.messages?.[0] || "Refresh failed");
      const {
        jwt: newJwt,
        refreshToken: newRt,
        refreshTokenExpirationDate: newExp,
      } = res.data;
      setTokens(newJwt, newRt, newExp);
    },
    onError: () => clear(),
  });
}
