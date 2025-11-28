import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateExaminationTypeRequest } from "..";
import { ExaminationTypesApi } from "../api/examination-types.api";
import { examinationTypesKeys } from "../api/examination-types.keys";

export function useUpdateExaminationType() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateExaminationTypeRequest) =>
      ExaminationTypesApi.update(payload),

    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({ queryKey: examinationTypesKeys.list() });
      qc.invalidateQueries({
        queryKey: examinationTypesKeys.detail(variables.id),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/examinationTypes");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
