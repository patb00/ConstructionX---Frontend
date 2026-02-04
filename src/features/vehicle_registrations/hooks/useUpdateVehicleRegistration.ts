import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateVehicleRegistrationRequest } from "..";
import { VehicleRegistrationsApi } from "../api/vehicle-registration.api";
import { vehicleRegistrationsKeys } from "../api/vehicle-tegistration.keys";

export function useUpdateVehicleRegistration() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateVehicleRegistrationRequest) =>
      VehicleRegistrationsApi.update(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRegistrationsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Updated", {
        variant: "success",
      });
      navigate("/app/vehicle-registrations");
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
