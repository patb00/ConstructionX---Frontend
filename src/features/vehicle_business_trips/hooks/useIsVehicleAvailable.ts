import { useQuery } from "@tanstack/react-query";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";

export function useIsVehicleAvailable(args: {
  vehicleId: number;
  startAt: string;
  endAt: string;
  excludeTripId?: number;
}) {
  const enabled =
    Number.isFinite(args.vehicleId) &&
    args.vehicleId > 0 &&
    !!args.startAt &&
    !!args.endAt;

  return useQuery<boolean>({
    queryKey: ["vehicleBusinessTrips", "isVehicleAvailable", args],
    queryFn: () => VehicleBusinessTripsApi.isVehicleAvailable(args),
    enabled,
  });
}
