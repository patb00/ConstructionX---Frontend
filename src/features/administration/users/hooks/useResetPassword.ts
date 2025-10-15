import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { UsersApi } from "../api/users.api";
import { usersKeys } from "../api/users.keys";
import type { ResetPasswordVariables } from "..";

export function useResetPassword() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ tenant, payload }: ResetPasswordVariables) =>
      UsersApi.resetPassword(tenant, payload),

    onSuccess: (data) => {
      // Consistent invalidation
      qc.invalidateQueries({ queryKey: usersKeys.list() });

      enqueueSnackbar(
        data?.messages?.[0] || data?.messages || "Password has been reset.",
        {
          variant: "success",
        }
      );
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
