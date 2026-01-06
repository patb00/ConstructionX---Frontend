import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { CreateVehicleRepairRequest } from "..";
import { VehicleRepairsApi } from "../api/vehicle-repairs.api";
import { vehicleRepairsKeys } from "../api/vehicle-repairs.keys";

export function useAddVehicleRepair() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: CreateVehicleRepairRequest) =>
      VehicleRepairsApi.add(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRepairsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Saved", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
