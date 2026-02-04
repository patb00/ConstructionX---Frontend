import { useMemo } from "react";
import { useVehicleTypes } from "../../vehicles/constants/hooks/useVehiclesTypes";

export type Option = { label: string; value: string };

export function useVehicleTypeOptions() {
  const { data: types = [], isLoading, isError, error } = useVehicleTypes();

  const options: Option[] = useMemo(
    () =>
      (types ?? []).map((t: string) => ({
        label: t,
        value: t,
      })),
    [types]
  );

  return { options, isLoading, isError, error };
}
