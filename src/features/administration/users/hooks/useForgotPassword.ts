import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { UsersApi } from "../api/users.api";
import { usersKeys } from "../api/users.keys";
import type { ForgotPasswordVariables } from "..";

export function useForgotPassword() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ tenant, payload }: ForgotPasswordVariables) =>
      UsersApi.forgotPassword(tenant, payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: usersKeys.list() });

      enqueueSnackbar(
        data?.messages?.[0] || data?.messages || "Password reset email sent.",
        { variant: "success" }
      );
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
