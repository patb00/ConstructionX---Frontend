import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { UsersApi } from "../api/users.api";
import { usersKeys } from "../api/users.keys";
import type { UpdateUserStatusRequest } from "..";

export function useActivateUser() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateUserStatusRequest) =>
      UsersApi.updateStatus(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: usersKeys.list() });

      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
