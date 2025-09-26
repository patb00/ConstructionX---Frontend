import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login";
import type { LoginRequest, ApiResponse, TokenResponse } from "../types";
import { useAuthStore } from "../model/auth.store";

export function useLogin() {
  return useMutation<ApiResponse<TokenResponse>, any, LoginRequest>({
    mutationFn: (payload) => login(payload),
    onSuccess: () => {
      useAuthStore.setState({ isAuthed: true });
    },
  });
}
