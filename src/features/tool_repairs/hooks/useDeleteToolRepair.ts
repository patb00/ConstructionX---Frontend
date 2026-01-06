import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { ToolRepairsApi } from "../api/tool-repairs.api";
import { toolRepairsKeys } from "../api/tool-repairs.keys";

export function useDeleteToolRepair() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (repairId: number) => ToolRepairsApi.delete(repairId),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: toolRepairsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Deleted", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
