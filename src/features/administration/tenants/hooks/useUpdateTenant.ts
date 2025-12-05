import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";
import type { TenantId, UpdateTenantRequest } from "..";
import { useNavigate } from "react-router-dom";

export function useUpdateTenant() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
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

      navigate("/app/administration/tenants");
    },

    onError: (err: any) =>
      enqueueSnackbar(err.message, {
        variant: "error",
      }),
  });
}
