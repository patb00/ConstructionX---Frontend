import { useQuery } from "@tanstack/react-query";
import type { VehicleBusinessTrip } from "..";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";

export function useVehicleBusinessTrip(businessTripId: number) {
  return useQuery<VehicleBusinessTrip>({
    queryKey: vehicleBusinessTripsKeys.detail(businessTripId),
    queryFn: () => VehicleBusinessTripsApi.getById(businessTripId),
    enabled: Number.isFinite(businessTripId) && businessTripId > 0,
  });
}
