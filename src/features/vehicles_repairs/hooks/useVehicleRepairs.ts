import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { VehicleRepair, PagedResult } from "..";
import { vehicleRepairsKeys } from "../api/vehicles-repairs.keys";
import { VehicleRepairsApi } from "../api/vehicles-repairs.api";

interface TransformedVehicleRepairsData {
  columnDefs: GridColDef<VehicleRepair>[];
  rowDefs: VehicleRepair[];
  total: number;
}

export const useVehicleRepairs = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<VehicleRepair>,
    Error,
    TransformedVehicleRepairsData
  >({
    queryKey: vehicleRepairsKeys.list(
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      VehicleRepairsApi.getAll(
        paginationModel.page + 1,
        paginationModel.pageSize
      ),
    select: (paged): TransformedVehicleRepairsData => {
      const rows = paged.items ?? [];
      if (!rows.length)
        return { columnDefs: [], rowDefs: [], total: paged.total };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return {
          field: key,
          headerName,
          width: 180,
        };
      });

      const rowDefs = rows.map((r) => ({ ...r, id: (r as any).id }));
      return { columnDefs, rowDefs, total: paged.total };
    },
    placeholderData: (prev) => prev,
  });

  return {
    vehicleRepairsRows: data?.rowDefs ?? [],
    vehicleRepairsColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
