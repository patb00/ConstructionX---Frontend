import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import { CondosApi } from "../api/condos.api";
import { condosKeys } from "../api/condos.keys";
import type { NewCondoRequest } from "..";

export function useAddCondo() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewCondoRequest) => CondosApi.add(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: condosKeys.list() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/condos");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
