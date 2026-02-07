import { useQuery } from "@tanstack/react-query";

import type { VehicleRegistrationEmployee } from "..";
import { vehicleRegistrationEmployeesKeys } from "../api/vehicle-registration-employee.keys";
import { VehicleRegistrationEmployeesApi } from "../api/vehicle-registration-employee.api";

export function useVehicleRegistrationEmployeesByEmployee(
  employeeId: number,
  options?: { enabled?: boolean }
) {
  return useQuery<VehicleRegistrationEmployee[]>({
    queryKey: vehicleRegistrationEmployeesKeys.byEmployee(employeeId),
    queryFn: () => VehicleRegistrationEmployeesApi.byEmployee(employeeId),
    enabled:
      (options?.enabled ?? true) &&
      Number.isFinite(employeeId) &&
      employeeId > 0,
  });
}
