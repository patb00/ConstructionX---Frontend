import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { VehicleBusinessTrip, PagedResult } from "..";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";

interface TransformedData {
  columnDefs: GridColDef<VehicleBusinessTrip>[];
  rowDefs: VehicleBusinessTrip[];
  total: number;
}

export const useVehicleBusinessTrips = () => {
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
      paginationModel.pageSize
    ),
    queryFn: () =>
      VehicleBusinessTripsApi.getAll(
        paginationModel.page + 1,
        paginationModel.pageSize
      ),
    select: (paged): TransformedData => {
      const rows = paged.items ?? [];
      if (!rows.length)
        return { columnDefs: [], rowDefs: [], total: paged.total };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return { field: key, headerName, width: 180 };
      });

      const rowDefs = rows.map((r) => ({ ...r, id: (r as any).id }));
      return { columnDefs, rowDefs, total: paged.total };
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
