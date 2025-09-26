import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";
import type { UpdateSubscriptionRequest } from "../types";

export function useUpdateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSubscriptionRequest) =>
      TenantsApi.updateSubscription(payload),
    onSuccess: (_data, payload) => {
      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
      if (payload.tenantId) {
        qc.invalidateQueries({
          queryKey: tenantsKeys.detail(payload.tenantId),
        });
      }
    },
  });
}
