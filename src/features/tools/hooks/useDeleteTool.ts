import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { ToolsApi } from "../api/tools.api";
import { toolsKeys } from "../api/tools.keys";

export function useDeleteTool() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (toolId: number) => ToolsApi.delete(toolId),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: toolsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
