import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";
import type { UpdateSubscriptionRequest } from "..";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export function useUpdateSubscription() {
  const qc = useQueryClient();
  const navigate = useNavigate();

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

      enqueueSnackbar(
        data.messages?.[0] || data?.messages || "Pretplata ažurirana",
        {
          variant: "success",
        }
      );

      navigate("/app/administration/tenants");
    },

    onError: (error: any) => {
      enqueueSnackbar(
        error.messages?.[0] ||
          error?.messages ||
          "Greška pri ažuriranju pretplate",
        {
          variant: "error",
        }
      );
    },
  });
}
