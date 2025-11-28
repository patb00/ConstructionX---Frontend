import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";
import { medicalExaminationsKeys } from "../api/medical-examinations.keys";

interface UploadCertificatePayload {
  medicalExaminationId: number;
  file: File;
}

export function useUploadMedicalExaminationCertificate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ medicalExaminationId, file }: UploadCertificatePayload) =>
      MedicalExaminationsApi.uploadCertificate(medicalExaminationId, file),

    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({
        queryKey: medicalExaminationsKeys.detail(
          variables.medicalExaminationId
        ),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
