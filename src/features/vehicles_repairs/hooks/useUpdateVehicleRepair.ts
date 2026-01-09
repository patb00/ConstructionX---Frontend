import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateVehicleRepairRequest } from "..";
import { vehicleRepairsKeys } from "../api/vehicles-repairs.keys";
import { VehicleRepairsApi } from "../api/vehicles-repairs.api";

export function useUpdateVehicleRepair() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateVehicleRepairRequest) =>
      VehicleRepairsApi.update(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRepairsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Updated", {
        variant: "success",
      });
      navigate("/app/vehicle-repairs");
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
