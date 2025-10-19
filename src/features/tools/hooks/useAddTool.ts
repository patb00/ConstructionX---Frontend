import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import { ToolsApi } from "../api/tools.api";
import { toolsKeys } from "../api/tools.keys";
import type { NewToolRequest } from "..";

export function useAddTool() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewToolRequest) => ToolsApi.add(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: toolsKeys.list() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/tools");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
