import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { AssignEmployeesToCondoRequest } from "..";
import { CondosApi } from "../api/condos.api";
import { condosKeys } from "../api/condos.keys";

export function useAssignEmployeesToCondo() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: AssignEmployeesToCondoRequest) =>
      CondosApi.assignEmployees(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: condosKeys.list() });
      qc.invalidateQueries({ queryKey: condosKeys.all });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
