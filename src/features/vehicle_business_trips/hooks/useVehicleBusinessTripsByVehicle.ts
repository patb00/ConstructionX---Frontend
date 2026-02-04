import { useQuery } from "@tanstack/react-query";
import type { VehicleBusinessTrip } from "..";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";

export function useVehicleBusinessTripsByVehicle(vehicleId: number) {
  return useQuery<VehicleBusinessTrip[]>({
    queryKey: vehicleBusinessTripsKeys.byVehicle(vehicleId),
    queryFn: () => VehicleBusinessTripsApi.getByVehicle(vehicleId),
    enabled: Number.isFinite(vehicleId) && vehicleId > 0,
  });
}
