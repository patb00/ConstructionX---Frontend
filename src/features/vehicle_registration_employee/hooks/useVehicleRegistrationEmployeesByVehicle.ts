import { useQuery } from "@tanstack/react-query";

import type { VehicleRegistrationEmployee } from "..";
import { VehicleRegistrationEmployeesApi } from "../api/vehicle-registration-employee.api";
import { vehicleRegistrationEmployeesKeys } from "../api/vehicle-registration-employee.keys";

export function useVehicleRegistrationEmployeesByVehicle(vehicleId: number) {
  return useQuery<VehicleRegistrationEmployee[]>({
    queryKey: vehicleRegistrationEmployeesKeys.byVehicle(vehicleId),
    queryFn: () => VehicleRegistrationEmployeesApi.byVehicle(vehicleId),
    enabled: Number.isFinite(vehicleId) && vehicleId > 0,
  });
}
