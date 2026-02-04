import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { VehicleRegistrationsApi } from "../api/vehicle-registration.api";
import { vehicleRegistrationsKeys } from "../api/vehicle-tegistration.keys";

interface UploadVehicleRegistrationDocumentPayload {
  registrationId: number;
  file: File;
}

export function useUploadVehicleRegistrationDocument() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({
      registrationId,
      file,
    }: UploadVehicleRegistrationDocumentPayload) =>
      VehicleRegistrationsApi.uploadDocument(registrationId, file),
    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({
        queryKey: vehicleRegistrationsKeys.detail(variables.registrationId),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
