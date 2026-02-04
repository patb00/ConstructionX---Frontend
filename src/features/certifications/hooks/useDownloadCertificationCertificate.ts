import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { CertificationsApi } from "../api/certifications.api";

export function useDownloadCertificationCertificate() {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (certificationId: number) =>
      CertificationsApi.downloadCertificate(certificationId),
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
