import { useQuery } from "@tanstack/react-query";
import type { VehicleRepair } from "..";
import { vehicleRepairsKeys } from "../api/vehicles-repairs.keys";
import { VehicleRepairsApi } from "../api/vehicles-repairs.api";

export function useVehicleRepair(repairId: number) {
  return useQuery<VehicleRepair>({
    queryKey: vehicleRepairsKeys.detail(repairId),
    queryFn: () => VehicleRepairsApi.getById(repairId),
    enabled: !!repairId,
  });
}
