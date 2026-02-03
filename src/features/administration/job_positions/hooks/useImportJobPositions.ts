import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { JobPositionsApi } from "../api/job-positions.api";
import { jobPositionsKeys } from "../api/job-positions.keys";

export function useImportJobPositions() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await JobPositionsApi.import(file);
      await queryClient.invalidateQueries({ queryKey: jobPositionsKeys.all });
      return result;
    },
    [queryClient]
  );
}
