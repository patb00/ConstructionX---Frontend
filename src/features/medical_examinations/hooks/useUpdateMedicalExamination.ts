import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateMedicalExaminationRequest } from "..";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";
import { medicalExaminationsKeys } from "../api/medical-examinations.keys";

export function useUpdateMedicalExamination() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateMedicalExaminationRequest) =>
      MedicalExaminationsApi.update(payload),

    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({ queryKey: medicalExaminationsKeys.lists() });
      qc.invalidateQueries({
        queryKey: medicalExaminationsKeys.detail(variables.id),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/medicalExaminations");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
