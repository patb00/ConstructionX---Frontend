import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { VehicleInsurancesApi } from "../api/vehicle-insurance.api";
import { vehicleInsurancesKeys } from "../api/vehicle-insurance.keys";

export function useDeleteVehicleInsurance() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (insuranceId: number) =>
      VehicleInsurancesApi.delete(insuranceId),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleInsurancesKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Deleted", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
