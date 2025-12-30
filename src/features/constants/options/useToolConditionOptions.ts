import { useMemo } from "react";
import { useToolConditions } from "../../tools/constants/hooks/useToolConditions";

export type Option = { label: string; value: string };

export function useToolConditionOptions() {
  const {
    data: conditions = [],
    isLoading,
    isError,
    error,
  } = useToolConditions();

  const options: Option[] = useMemo(
    () =>
      conditions.map((c: string) => ({
        label: c,
        value: c,
      })),
    [conditions]
  );

  return { options, isLoading, isError, error };
}
