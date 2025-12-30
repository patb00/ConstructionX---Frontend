import { useMemo } from "react";
import { useVehicleStatuses } from "../../vehicles/constants/hooks/useVehicleStatus";

export type Option = { label: string; value: string };

export function useVehicleStatusOptions() {
  const {
    data: statuses = [],
    isLoading,
    isError,
    error,
  } = useVehicleStatuses();

  const options: Option[] = useMemo(
    () =>
      (statuses ?? []).map((s: string) => ({
        label: s,
        value: s,
      })),
    [statuses]
  );

  return { options, isLoading, isError, error };
}
