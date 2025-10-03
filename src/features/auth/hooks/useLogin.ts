import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../api/login";
import { setTokens } from "../../../lib/auth";
import { getCurrentUser } from "../model/currentUser";
import { useAuthStore } from "../model/auth.store";
import { env } from "../../../config/env";

export function useLogin() {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      if (env.authMode === "header") {
        setTokens(res.data);
      }
      const user = getCurrentUser();
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setAuthed(!!user);
    },
  });
}
