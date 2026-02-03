import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { CertificationsApi } from "../api/certifications.api";
import { certificationsKeys } from "../api/certifications.keys";

interface UploadCertificationCertificatePayload {
  certificationId: number;
  file: File;
}

export function useUploadCertificationCertificate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({
      certificationId,
      file,
    }: UploadCertificationCertificatePayload) =>
      CertificationsApi.uploadCertificate(certificationId, file),
    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({
        queryKey: certificationsKeys.detail(variables.certificationId),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
