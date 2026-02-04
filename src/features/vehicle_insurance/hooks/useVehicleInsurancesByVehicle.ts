import { useQuery } from "@tanstack/react-query";
import type { VehicleInsurance } from "..";
import { vehicleInsurancesKeys } from "../api/vehicle-insurance.keys";
import { VehicleInsurancesApi } from "../api/vehicle-insurance.api";

export function useVehicleInsurancesByVehicle(vehicleId: number) {
  return useQuery<VehicleInsurance[]>({
    queryKey: vehicleInsurancesKeys.byVehicle(vehicleId),
    queryFn: () => VehicleInsurancesApi.getByVehicle(vehicleId),
    enabled: !!vehicleId,
  });
}
