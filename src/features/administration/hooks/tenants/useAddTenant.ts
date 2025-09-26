import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { TenantsApi } from "../../api/tenants/tenants.api";
import { tenantsKeys } from "../../api/tenants/tenants.keys";
import type { NewTenantRequest } from "../../types";

export function useAddTenant() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewTenantRequest) => TenantsApi.add(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
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
