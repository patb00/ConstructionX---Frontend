import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import { MaterialsApi } from "../api/materials.api";
import { materialsKeys } from "../api/materials.keys";
import type { UpdateMaterialRequest } from "..";

export function useUpdateMaterial() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateMaterialRequest) => MaterialsApi.update(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: materialsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/materials");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
