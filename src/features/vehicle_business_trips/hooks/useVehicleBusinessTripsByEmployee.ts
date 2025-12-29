import { useQuery } from "@tanstack/react-query";
import type { VehicleBusinessTrip } from "..";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";

export function useVehicleBusinessTripsByEmployee(employeeId: number) {
  return useQuery<VehicleBusinessTrip[]>({
    queryKey: vehicleBusinessTripsKeys.byEmployee(employeeId),
    queryFn: () => VehicleBusinessTripsApi.getByEmployee(employeeId),
    enabled: Number.isFinite(employeeId) && employeeId > 0,
  });
}
