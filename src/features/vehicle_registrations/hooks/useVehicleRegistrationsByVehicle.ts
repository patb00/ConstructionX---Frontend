import { useQuery } from "@tanstack/react-query";
import type { VehicleRegistration } from "..";
import { vehicleRegistrationsKeys } from "../api/vehicle-tegistration.keys";
import { VehicleRegistrationsApi } from "../api/vehicle-registration.api";

export function useVehicleRegistrationsByVehicle(vehicleId: number) {
  return useQuery<VehicleRegistration[]>({
    queryKey: vehicleRegistrationsKeys.byVehicle(vehicleId),
    queryFn: () => VehicleRegistrationsApi.getByVehicleId(vehicleId),
    enabled: !!vehicleId,
  });
}
