import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";

interface UploadTenantLogoPayload {
  tenantId: string;
  file: File;
}

export function useUploadTenantLogo() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ tenantId, file }: UploadTenantLogoPayload) =>
      TenantsApi.uploadLogo(tenantId, file),

    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({
        queryKey: tenantsKeys.detail(variables.tenantId),
      });

      enqueueSnackbar(data?.messages?.[0] || data?.message, {
        variant: "success",
      });
    },

    onError: (err: any) => {
      enqueueSnackbar(err?.message, {
        variant: "error",
      });
    },
  });
}
