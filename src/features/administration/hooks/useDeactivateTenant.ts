import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";

export function useDeactivateTenant() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (identifier: string) => TenantsApi.deactivate(identifier),

    onSuccess: (data: any, identifier) => {
      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
      qc.invalidateQueries({ queryKey: tenantsKeys.detail(identifier) });

      const msg = Array.isArray(data?.messages)
        ? data.messages[0]
        : data?.message || "Operation completed.";
      enqueueSnackbar(msg, { variant: "success" });
    },

    onError: (error: any) => {
      const msg = Array.isArray(error?.response?.data?.messages)
        ? error.response.data.messages[0]
        : error?.response?.data?.message ||
          error?.message ||
          JSON.stringify(error);
      enqueueSnackbar(msg, { variant: "error" });
    },
  });
}
