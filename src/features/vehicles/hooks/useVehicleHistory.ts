import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PagedResult, VehicleHistoryItem } from "..";
import { vehiclesKeys } from "../api/vehicles.keys";
import { VehiclesApi } from "../api/vehicles.api";

export const useVehicleHistory = (vehicleId: number) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const { data, error, isLoading, isError, isFetching } = useQuery<
    PagedResult<VehicleHistoryItem>
  >({
    queryKey: vehiclesKeys.history(
      vehicleId,
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      VehiclesApi.history(
        vehicleId,
        paginationModel.page + 1,
        paginationModel.pageSize
      ),
    enabled: Number.isFinite(vehicleId) && vehicleId > 0,
    placeholderData: (prev) => prev,
  });

  return {
    historyRows: data?.items ?? [],
    total: data?.total ?? 0,

    paginationModel,
    setPaginationModel,

    error,
    isLoading,
    isFetching,
    isError,
  };
};
