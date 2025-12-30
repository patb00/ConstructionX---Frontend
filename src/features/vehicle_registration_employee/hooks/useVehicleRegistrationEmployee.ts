import { useQuery } from "@tanstack/react-query";

import type { VehicleRegistrationEmployee } from "..";
import { vehicleRegistrationEmployeesKeys } from "../api/vehicle-registration-employee.keys";
import { VehicleRegistrationEmployeesApi } from "../api/vehicle-registration-employee.api";

export function useVehicleRegistrationEmployee(taskId: number) {
  return useQuery<VehicleRegistrationEmployee>({
    queryKey: vehicleRegistrationEmployeesKeys.detail(taskId),
    queryFn: () => VehicleRegistrationEmployeesApi.getById(taskId),
    enabled: Number.isFinite(taskId) && taskId > 0,
  });
}
