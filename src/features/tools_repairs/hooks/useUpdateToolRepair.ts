import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateToolRepairRequest } from "..";
import { ToolRepairsApi } from "../api/tools-repairs.api";
import { toolRepairsKeys } from "../api/tools-repairs.keys";

export function useUpdateToolRepair() {
  const navigate = useNavigate();
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
      navigate("/app/tool-repairs");
    },
    onError: (err: any) =>
      enqueueSnackbar(err?.message || "Error", { variant: "error" }),
  });
}
