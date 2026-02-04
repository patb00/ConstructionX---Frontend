import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { VehicleRepairsApi } from "../api/vehicles-repairs.api";
import { vehicleRepairsKeys } from "../api/vehicles-repairs.keys";

export function useDeleteVehicleRepair() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (repairId: number) => VehicleRepairsApi.delete(repairId),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRepairsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Deleted", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
