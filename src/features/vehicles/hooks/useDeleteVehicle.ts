import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { vehiclesKeys } from "../api/vehicles.keys";
import { VehiclesApi } from "../api/vehicles.api";

export function useDeleteVehicle() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (vehicleId: number) => VehiclesApi.delete(vehicleId),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehiclesKeys.list() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Deleted", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
