import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { ApproveVehicleBusinessTripRequest } from "..";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";

export function useApproveVehicleBusinessTrip() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: ApproveVehicleBusinessTripRequest) =>
      VehicleBusinessTripsApi.approve(payload),
    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({ queryKey: vehicleBusinessTripsKeys.lists() });
      qc.invalidateQueries({
        queryKey: vehicleBusinessTripsKeys.detail(variables.tripId),
      });

      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Approved", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
