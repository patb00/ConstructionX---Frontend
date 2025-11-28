import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { NewExaminationTypeRequest } from "..";
import { ExaminationTypesApi } from "../api/examination-types.api";
import { examinationTypesKeys } from "../api/examination-types.keys";

export function useAddExaminationType() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewExaminationTypeRequest) =>
      ExaminationTypesApi.add(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: examinationTypesKeys.list() });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/examinationTypes");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
