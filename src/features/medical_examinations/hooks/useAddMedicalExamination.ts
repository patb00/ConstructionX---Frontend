import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { NewMedicalExaminationRequest } from "..";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";
import { medicalExaminationsKeys } from "../api/medical-examinations.keys";

export function useAddMedicalExamination() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewMedicalExaminationRequest) =>
      MedicalExaminationsApi.add(payload),

    onSuccess: (data: any) => {
      console.log(data);
      qc.invalidateQueries({ queryKey: medicalExaminationsKeys.list() });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
      //navigate("/app/medicalExaminations");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
