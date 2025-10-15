import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { UpdateJobPositionRequest } from "..";
import { useNavigate } from "react-router-dom";
import { JobPositionsApi } from "../api/job-positions.api";
import { jobPositionsKeys } from "../api/job-positions.keys";

export function useUpdateJobPosition() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateJobPositionRequest) =>
      JobPositionsApi.update(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: jobPositionsKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });

      navigate("/app/administration/jobPositions");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
