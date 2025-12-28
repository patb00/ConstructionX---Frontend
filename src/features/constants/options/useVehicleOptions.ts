import { useMemo } from "react";
import { useVehicles } from "../../vehicles/hooks/useVehicles";

export type Option = { label: string; value: number };

export function useVehicleOptions() {
  const { vehiclesRows, isLoading, isError, error } = useVehicles();

  const options: Option[] = useMemo(() => {
    return (vehiclesRows ?? [])
      .filter((v: any) => typeof v?.id === "number")
      .map((v: any) => ({
        label: v.registrationNumber
          ? `${v.name} (${v.registrationNumber})`
          : v.name,
        value: v.id,
      }));
  }, [vehiclesRows]);

  return { options, isLoading, isError, error };
}
