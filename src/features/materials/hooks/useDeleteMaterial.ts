import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { MaterialsApi } from "../api/materials.api";
import { materialsKeys } from "../api/materials.keys";

export function useDeleteMaterial() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (materialId: number) => MaterialsApi.delete(materialId),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: materialsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
