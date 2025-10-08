import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { JobPositionsApi } from "../api/job-positions.api";
import { jobPositionsKeys } from "../api/job-positions.keys";

export function useDeleteJobPosition() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (employeeId: number) => JobPositionsApi.delete(employeeId),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: jobPositionsKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (error: any) => {
      enqueueSnackbar(error.messages[0] || error?.messages, {
        variant: "error",
      });
    },
  });
}
