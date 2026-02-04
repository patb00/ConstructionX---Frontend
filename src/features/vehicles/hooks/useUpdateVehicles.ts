import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateVehicleRequest } from "..";
import { vehiclesKeys } from "../api/vehicles.keys";
import { VehiclesApi } from "../api/vehicles.api";

export function useUpdateVehicle() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateVehicleRequest) => VehiclesApi.update(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehiclesKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Updated", {
        variant: "success",
      });
      navigate("/app/vehicles");
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
