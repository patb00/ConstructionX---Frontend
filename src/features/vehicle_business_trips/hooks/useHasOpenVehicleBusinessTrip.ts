import { useQuery } from "@tanstack/react-query";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";

export function useHasOpenVehicleBusinessTrip(vehicleId: number) {
  return useQuery<boolean>({
    queryKey: vehicleBusinessTripsKeys.hasOpenTrip(vehicleId),
    queryFn: () => VehicleBusinessTripsApi.hasOpenTrip(vehicleId),
    enabled: Number.isFinite(vehicleId) && vehicleId > 0,
  });
}
