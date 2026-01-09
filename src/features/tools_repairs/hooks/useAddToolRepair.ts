import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { NewToolRepairRequest } from "..";
import { toolRepairsKeys } from "../api/tools-repairs.keys";
import { ToolRepairsApi } from "../api/tools-repairs.api";

export function useAddToolRepair() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewToolRepairRequest) => ToolRepairsApi.add(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: toolRepairsKeys.lists() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages || "Saved", {
        variant: "success",
      });
      navigate("/app/tool-repairs");
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
