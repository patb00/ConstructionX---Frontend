import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RolesApi } from "../api/roles.api";
import { useSnackbar } from "notistack";
import type { UpdatePermissionsRequest } from "..";
import { rolesKeys } from "../api/roles.keys";

export function useUpdateRolePermissions() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdatePermissionsRequest) =>
      RolesApi.updatePermissions(payload),

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
