import { useQuery } from "@tanstack/react-query";
import type { Vehicle } from "..";
import { vehiclesKeys } from "../api/vehicles.keys";
import { VehiclesApi } from "../api/vehicles.api";

export function useVehicle(vehicleId: number) {
  return useQuery<Vehicle>({
    queryKey: vehiclesKeys.detail(vehicleId),
    queryFn: () => VehiclesApi.getById(vehicleId),
  });
}
