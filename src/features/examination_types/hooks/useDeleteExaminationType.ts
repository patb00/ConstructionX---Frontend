import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { ExaminationTypesApi } from "../api/examination-types.api";
import { examinationTypesKeys } from "../api/examination-types.keys";

export function useDeleteExaminationType() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (examinationTypeId: number) =>
      ExaminationTypesApi.delete(examinationTypeId),

    onSuccess: (data: any, examinationTypeId) => {
      qc.invalidateQueries({ queryKey: examinationTypesKeys.list() });
      qc.invalidateQueries({
        queryKey: examinationTypesKeys.detail(examinationTypeId),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
