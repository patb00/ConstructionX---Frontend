import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";
import type { TenantId, UpdateTenantRequest } from "..";

export function useUpdateTenant() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({
      tenantId,
      payload,
    }: {
      tenantId: TenantId;
      payload: UpdateTenantRequest;
    }) => TenantsApi.update(tenantId, payload),

    onSuccess: (data, variables) => {
      const { tenantId } = variables;

      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
      qc.invalidateQueries({ queryKey: tenantsKeys.detail(tenantId) });

      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) =>
      enqueueSnackbar(err.message, {
        variant: "error",
      }),
  });
}
