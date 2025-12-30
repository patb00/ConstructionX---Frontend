import { useMemo } from "react";
import { useToolStatuses } from "../../tools/constants/hooks/useToolStatuses";

export type Option = { label: string; value: string };

export function useToolStatusOptions() {
  const { data: statuses = [], isLoading, isError, error } = useToolStatuses();

  const options: Option[] = useMemo(
    () =>
      statuses.map((s: string) => ({
        label: s,
        value: s,
      })),
    [statuses]
  );

  return { options, isLoading, isError, error };
}
