import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

import type { NewMedicalExaminationRequest } from "..";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";
import { medicalExaminationsKeys } from "../api/medical-examinations.keys";

export function useAddMedicalExamination() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewMedicalExaminationRequest) =>
      MedicalExaminationsApi.add(payload),

    onSuccess: (data: any) => {
      console.log(data);
      qc.invalidateQueries({ queryKey: medicalExaminationsKeys.lists() });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
