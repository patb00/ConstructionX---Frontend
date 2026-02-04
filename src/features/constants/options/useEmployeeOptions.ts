import { useMemo } from "react";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";

export type Option = { label: string; value: number };

export function useEmployeeOptions() {
  const { employeeRows, isLoading, isError, error } = useEmployees();

  const options: Option[] = useMemo(() => {
    return (employeeRows ?? [])
      .filter((e: any) => typeof e?.id === "number")
      .map((e: any) => ({
        label: `${e.firstName} ${e.lastName}`,
        value: e.id,
      }));
  }, [employeeRows]);

  return { options, isLoading, isError, error };
}
