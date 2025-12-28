import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateVehicleInsuranceRequest } from "..";
import { VehicleInsurancesApi } from "../api/vehicle-insurance.api";
import { vehicleInsurancesKeys } from "../api/vehicle-insurance.keys";

export function useUpdateVehicleInsurance() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateVehicleInsuranceRequest) =>
      VehicleInsurancesApi.update(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleInsurancesKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Updated", {
        variant: "success",
      });
      navigate("/app/vehicle-insurances");
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
