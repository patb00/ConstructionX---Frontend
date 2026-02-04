import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { VehicleRegistration, PagedResult } from "..";
import { VehicleRegistrationsApi } from "../api/vehicle-registration.api";
import { vehicleRegistrationsKeys } from "../api/vehicle-tegistration.keys";

interface TransformedVehicleRegistrationsData {
  columnDefs: GridColDef<VehicleRegistration>[];
  rowDefs: VehicleRegistration[];
  total: number;
}

export const useVehicleRegistrations = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<VehicleRegistration>,
    Error,
    TransformedVehicleRegistrationsData
  >({
    queryKey: vehicleRegistrationsKeys.list(
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      VehicleRegistrationsApi.getAll(
        paginationModel.page + 1,
        paginationModel.pageSize
      ),
    select: (paged): TransformedVehicleRegistrationsData => {
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
    vehicleRegistrationsRows: data?.rowDefs ?? [],
    vehicleRegistrationsColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
