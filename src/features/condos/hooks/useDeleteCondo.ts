import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

import { CondosApi } from "../api/condos.api";
import { condosKeys } from "../api/condos.keys";

export function useDeleteCondo() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (condoId: number) => CondosApi.delete(condoId),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: condosKeys.list() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
