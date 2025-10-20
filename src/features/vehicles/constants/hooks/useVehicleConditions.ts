import { useQuery } from "@tanstack/react-query";
import { vehicleConstantsKeys } from "../api/vehicle-constants.keys";
import { VehicleConstantsApi } from "../api/vehicle.constants.api";

export function useVehicleConditions() {
  return useQuery<string[]>({
    queryKey: vehicleConstantsKeys.conditions(),
    queryFn: VehicleConstantsApi.getConditions,
  });
}
