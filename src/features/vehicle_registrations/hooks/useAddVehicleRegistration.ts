import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { NewVehicleRegistrationRequest } from "..";
import { vehicleRegistrationsKeys } from "../api/vehicle-tegistration.keys";
import { VehicleRegistrationsApi } from "../api/vehicle-registration.api";

export function useAddVehicleRegistration() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewVehicleRegistrationRequest) =>
      VehicleRegistrationsApi.add(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRegistrationsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Saved", {
        variant: "success",
      });
      navigate("/app/vehicle-registrations");
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
