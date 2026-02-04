import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { VehicleInsurancesApi } from "../api/vehicle-insurance.api";
import { vehicleInsurancesKeys } from "../api/vehicle-insurance.keys";

interface UploadVehicleInsuranceDocumentPayload {
  insuranceId: number;
  file: File;
}

export function useUploadVehicleInsuranceDocument() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ insuranceId, file }: UploadVehicleInsuranceDocumentPayload) =>
      VehicleInsurancesApi.uploadDocument(insuranceId, file),
    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({
        queryKey: vehicleInsurancesKeys.detail(variables.insuranceId),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
