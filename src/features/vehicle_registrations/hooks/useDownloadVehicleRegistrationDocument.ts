import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { VehicleRegistrationsApi } from "../api/vehicle-registration.api";

export function useDownloadVehicleRegistrationDocument() {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (registrationId: number) =>
      VehicleRegistrationsApi.downloadDocument(registrationId),
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
