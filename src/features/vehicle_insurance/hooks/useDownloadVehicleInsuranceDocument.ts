import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { VehicleInsurancesApi } from "../api/vehicle-insurance.api";

export function useDownloadVehicleInsuranceDocument() {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (insuranceId: number) =>
      VehicleInsurancesApi.downloadDocument(insuranceId),
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
