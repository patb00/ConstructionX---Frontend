import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { UpdateToolRepairRequest } from "..";
import { ToolRepairsApi } from "../api/tool-repairs.api";
import { toolRepairsKeys } from "../api/tool-repairs.keys";

export function useUpdateToolRepair() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateToolRepairRequest) =>
      ToolRepairsApi.update(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: toolRepairsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Updated", {
        variant: "success",
      });
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
