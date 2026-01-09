import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { NewVehicleRepairRequest } from "..";
import { VehicleRepairsApi } from "../api/vehicles-repairs.api";
import { vehicleRepairsKeys } from "../api/vehicles-repairs.keys";

export function useAddVehicleRepair() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewVehicleRepairRequest) =>
      VehicleRepairsApi.add(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRepairsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Saved", {
        variant: "success",
      });
      navigate("/app/vehicle-repairs");
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
