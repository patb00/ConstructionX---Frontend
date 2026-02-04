import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";

export function useDownloadMedicalExaminationCertificate() {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (medicalExaminationId: number) =>
      MedicalExaminationsApi.downloadCertificate(medicalExaminationId),
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
