import { useQuery } from "@tanstack/react-query";
import type { JobPosition } from "..";
import { jobPositionsKeys } from "../api/job-positions.keys";
import { JobPositionsApi } from "../api/job-positions.api";

export function useJobPosition(jobPosition: number) {
  return useQuery<JobPosition>({
    queryKey: jobPositionsKeys.detail(jobPosition),
    queryFn: () => JobPositionsApi.getById(jobPosition),
  });
}
