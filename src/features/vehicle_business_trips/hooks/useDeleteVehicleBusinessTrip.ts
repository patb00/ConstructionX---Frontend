import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";

export function useDeleteVehicleBusinessTrip() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (businessTripId: number) =>
      VehicleBusinessTripsApi.delete(businessTripId),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleBusinessTripsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Deleted", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
