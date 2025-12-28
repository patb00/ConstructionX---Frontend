import { vehiclesKeys } from "../api/vehicles.keys";
import { VehiclesApi } from "../api/vehicles.api";
import type { PagedResult, VehicleHistoryItem } from "..";

export const vehicleHistoryQuery = {
  key: (vehicleId: number, page0: number, pageSize: number) =>
    vehiclesKeys.history(vehicleId, page0, pageSize),
  fetch: (vehicleId: number, page0: number, pageSize: number) =>
    VehiclesApi.history(vehicleId, page0 + 1, pageSize) as Promise<
      PagedResult<VehicleHistoryItem>
    >,
};
