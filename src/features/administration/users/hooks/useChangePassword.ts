import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChangePasswordRequest } from "..";
import { useSnackbar } from "notistack";
import { UsersApi } from "../api/users.api";
import { usersKeys } from "../api/users.keys";

export function useChangePassword() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      UsersApi.changePassword(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: usersKeys.list() });

      enqueueSnackbar(
        data?.messages?.[0] || data?.messages || "Password changed.",
        {
          variant: "success",
        }
      );
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
