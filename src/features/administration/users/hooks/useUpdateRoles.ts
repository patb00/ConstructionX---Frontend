import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { UpdateUserRolesRequest } from "..";
import { usersKeys } from "../api/users.keys";
import { UsersApi } from "../api/users.api";

export function useUpdateRoles() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (params: { userId: string; payload: UpdateUserRolesRequest }) =>
      UsersApi.updateRoles(params.userId, params.payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: usersKeys.list() });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (error: any) => {
      enqueueSnackbar(error.messages?.[0] || error?.messages, {
        variant: "error",
      });
    },
  });
}
