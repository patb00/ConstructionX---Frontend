import { useMemo } from "react";
import { useVehicleConditions } from "../../vehicles/constants/hooks/useVehicleConditions";

export type Option = { label: string; value: string };

export function useVehicleConditionOptions() {
  const {
    data: conditions = [],
    isLoading,
    isError,
    error,
  } = useVehicleConditions();

  const options: Option[] = useMemo(
    () =>
      (conditions ?? []).map((c: string) => ({
        label: c,
        value: c,
      })),
    [conditions]
  );

  return { options, isLoading, isError, error };
}
