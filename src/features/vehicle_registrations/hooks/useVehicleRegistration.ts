import { useQuery } from "@tanstack/react-query";
import type { VehicleRegistration } from "..";
import { vehicleRegistrationsKeys } from "../api/vehicle-tegistration.keys";
import { VehicleRegistrationsApi } from "../api/vehicle-registration.api";

export function useVehicleRegistration(registrationId: number) {
  return useQuery<VehicleRegistration>({
    queryKey: vehicleRegistrationsKeys.detail(registrationId),
    queryFn: () => VehicleRegistrationsApi.getById(registrationId),
    enabled: !!registrationId,
  });
}
