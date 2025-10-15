import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { NewJobPositionRequest } from "..";
import { JobPositionsApi } from "../api/job-positions.api";
import { jobPositionsKeys } from "../api/job-positions.keys";

export function useAddJobPosition() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewJobPositionRequest) =>
      JobPositionsApi.add(payload),

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
