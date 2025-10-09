import { useJobPositions } from "../../job_positions/hooks/useJobPositions";

export function useJobPositionOptions() {
  const { jobPositionsRows, isLoading, error } = useJobPositions();

  const options =
    jobPositionsRows?.map((jp) => ({
      label: jp.name ?? `#${jp.id}`,
      value: jp.id,
    })) ?? [];

  return { options, isLoading, error };
}
