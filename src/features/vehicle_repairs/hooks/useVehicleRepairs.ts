import { useQuery } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { PagedResult, VehicleRepair } from "..";
import { VehicleRepairsApi } from "../api/vehicle-repairs.api";
import { vehicleRepairsKeys } from "../api/vehicle-repairs.keys";

interface UseVehicleRepairsResult {
  repairs: VehicleRepair[];
  total: number;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: Dispatch<SetStateAction<{ page: number; pageSize: number }>>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useVehicleRepairs(vehicleId: number): UseVehicleRepairsResult {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<VehicleRepair>
  >({
    queryKey: vehicleRepairsKeys.list(
      vehicleId,
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      VehicleRepairsApi.getByVehicle(
        vehicleId,
        paginationModel.page + 1,
        paginationModel.pageSize
      ),
    placeholderData: (prev) => prev,
    enabled: !!vehicleId,
  });

  return {
    repairs: data?.items ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    isLoading,
    isError,
    error: error ?? null,
  };
}
