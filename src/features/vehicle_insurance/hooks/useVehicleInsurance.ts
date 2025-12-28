import { useQuery } from "@tanstack/react-query";
import type { VehicleInsurance } from "..";
import { vehicleInsurancesKeys } from "../api/vehicle-insurance.keys";
import { VehicleInsurancesApi } from "../api/vehicle-insurance.api";

export function useVehicleInsurance(insuranceId: number) {
  return useQuery<VehicleInsurance>({
    queryKey: vehicleInsurancesKeys.detail(insuranceId),
    queryFn: () => VehicleInsurancesApi.getById(insuranceId),
  });
}
