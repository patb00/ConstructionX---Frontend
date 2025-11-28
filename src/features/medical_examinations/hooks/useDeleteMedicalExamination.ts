import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";
import { medicalExaminationsKeys } from "../api/medical-examinations.keys";

export function useDeleteMedicalExamination() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (medicalExaminationId: number) =>
      MedicalExaminationsApi.delete(medicalExaminationId),

    onSuccess: (data: any, medicalExaminationId) => {
      qc.invalidateQueries({ queryKey: medicalExaminationsKeys.list() });
      qc.invalidateQueries({
        queryKey: medicalExaminationsKeys.detail(medicalExaminationId),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
