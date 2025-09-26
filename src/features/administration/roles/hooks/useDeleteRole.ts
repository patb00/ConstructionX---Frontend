import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { RolesApi } from "../api/roles.api";
import { rolesKeys } from "../api/roles.keys";

export function useDeleteRole() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (roleId: string) => RolesApi.delete(roleId),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: rolesKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (error: any) => {
      enqueueSnackbar(error.messages[0] || error?.messages, {
        variant: "error",
      });
    },
  });
}
