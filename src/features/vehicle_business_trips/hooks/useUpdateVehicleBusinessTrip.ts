import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateVehicleBusinessTripRequest } from "..";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";

export function useUpdateVehicleBusinessTrip() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateVehicleBusinessTripRequest) =>
      VehicleBusinessTripsApi.update(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleBusinessTripsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Updated", {
        variant: "success",
      });
      navigate("/app/vehicle-business-trips");
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
