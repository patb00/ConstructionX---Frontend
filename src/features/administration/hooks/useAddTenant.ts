import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";
import type { NewTenantRequest } from "../types";

export function useAddTenant() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewTenantRequest) => TenantsApi.add(payload),

    onSuccess: (data) => {
      const message =
        (data as { message?: string })?.message ?? JSON.stringify(data);
      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
      enqueueSnackbar(message, { variant: "success" });
    },

    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: any };
        message?: string;
      };

      let message: string | undefined;
      if (Array.isArray(err.response?.data?.Messages)) {
        message = err.response!.data.Messages.join("\n");
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else {
        message = err.message ?? JSON.stringify(error);
      }

      enqueueSnackbar(message, { variant: "error" });
    },
  });
}
