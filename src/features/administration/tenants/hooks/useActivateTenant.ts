import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";

export function useActivateTenant() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (identifier: string) => TenantsApi.activate(identifier),

    onSuccess: (data: any, identifier) => {
      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
      qc.invalidateQueries({ queryKey: tenantsKeys.detail(identifier) });

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
