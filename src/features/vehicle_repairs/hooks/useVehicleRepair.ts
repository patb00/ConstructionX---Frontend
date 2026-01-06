import { useQuery } from "@tanstack/react-query";
import type { VehicleRepair } from "..";
import { VehicleRepairsApi } from "../api/vehicle-repairs.api";
import { vehicleRepairsKeys } from "../api/vehicle-repairs.keys";

export function useVehicleRepair(repairId: number) {
  return useQuery<VehicleRepair>({
    queryKey: vehicleRepairsKeys.detail(repairId),
    queryFn: () => VehicleRepairsApi.getById(repairId),
    enabled: !!repairId,
  });
}
