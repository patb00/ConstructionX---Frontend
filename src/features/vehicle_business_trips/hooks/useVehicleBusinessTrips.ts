import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GridColDef } from "@mui/x-data-grid";

import type { VehicleBusinessTrip, PagedResult } from "..";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";

interface TransformedData {
  columnDefs: GridColDef<VehicleBusinessTrip>[];
  rowDefs: VehicleBusinessTrip[];
  total: number;
}

function headerize(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export const useVehicleBusinessTrips = (tripStatus?: number) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<VehicleBusinessTrip>,
    Error,
    TransformedData
  >({
    queryKey: vehicleBusinessTripsKeys.list(
      paginationModel.page,
      paginationModel.pageSize,
      tripStatus,
    ),
    queryFn: () =>
      VehicleBusinessTripsApi.getAll(
        paginationModel.page + 1,
        paginationModel.pageSize,
        tripStatus,
      ),
    select: (paged): TransformedData => {
      const rows = paged.items ?? [];
      const total = paged.total ?? 0;

      if (!rows.length) {
        return { columnDefs: [], rowDefs: [], total };
      }

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef<VehicleBusinessTrip>[] = allKeys.map(
        (field) => ({
          field,
          headerName: headerize(field),
          width: 180,
        }),
      );

      const rowDefs = rows.map((r) => ({ ...r, id: (r as any).id }));

      return { columnDefs, rowDefs, total };
    },
    placeholderData: (prev) => prev,
  });

  return {
    vehicleBusinessTripsRows: data?.rowDefs ?? [],
    vehicleBusinessTripsColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,

    paginationModel,
    setPaginationModel,

    error,
    isLoading,
    isError,
  };
};
