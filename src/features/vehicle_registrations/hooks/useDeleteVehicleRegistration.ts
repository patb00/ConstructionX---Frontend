import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { vehicleRegistrationsKeys } from "../api/vehicle-tegistration.keys";
import { VehicleRegistrationsApi } from "../api/vehicle-registration.api";

export function useDeleteVehicleRegistration() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (registrationId: number) =>
      VehicleRegistrationsApi.delete(registrationId),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRegistrationsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Deleted", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
