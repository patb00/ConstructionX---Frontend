import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TenantsApi } from "../../api/tenants/tenants.api";
import { tenantsKeys } from "../../api/tenants/tenants.keys";
import type { UpdateSubscriptionRequest } from "../../types";
import { enqueueSnackbar } from "notistack";

export function useUpdateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSubscriptionRequest) =>
      TenantsApi.updateSubscription(payload),
    onSuccess: (data, payload) => {
      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
      if (payload.tenantId) {
        qc.invalidateQueries({
          queryKey: tenantsKeys.detail(payload.tenantId),
        });
      }
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
