import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { RejectVehicleBusinessTripRequest } from "..";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";

export function useRejectVehicleBusinessTrip() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: RejectVehicleBusinessTripRequest) =>
      VehicleBusinessTripsApi.reject(payload),
    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({ queryKey: vehicleBusinessTripsKeys.lists() });
      qc.invalidateQueries({
        queryKey: vehicleBusinessTripsKeys.detail(variables.tripId),
      });

      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Rejected", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
