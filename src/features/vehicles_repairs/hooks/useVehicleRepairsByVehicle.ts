import { useQuery } from "@tanstack/react-query";
import type { PagedResult, VehicleRepair } from "..";
import { vehicleRepairsKeys } from "../api/vehicles-repairs.keys";
import { VehicleRepairsApi } from "../api/vehicles-repairs.api";

export function useVehicleRepairsByVehicle(
  vehicleId: number,
  page = 1,
  pageSize = 10
) {
  return useQuery<PagedResult<VehicleRepair>>({
    queryKey: vehicleRepairsKeys.byVehicle(vehicleId, page, pageSize),
    queryFn: () => VehicleRepairsApi.getByVehicleId(vehicleId, page, pageSize),
    enabled: !!vehicleId,
  });
}
