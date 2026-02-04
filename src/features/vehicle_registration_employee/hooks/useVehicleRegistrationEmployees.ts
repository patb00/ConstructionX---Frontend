import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";

import type { PagedResult, VehicleRegistrationEmployee } from "..";
import { vehicleRegistrationEmployeesKeys } from "../api/vehicle-registration-employee.keys";
import { VehicleRegistrationEmployeesApi } from "../api/vehicle-registration-employee.api";

interface TransformedData {
  columnDefs: GridColDef<VehicleRegistrationEmployee>[];
  rowDefs: VehicleRegistrationEmployee[];
  total: number;
}

export const useVehicleRegistrationEmployees = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<VehicleRegistrationEmployee>,
    Error,
    TransformedData
  >({
    queryKey: vehicleRegistrationEmployeesKeys.list({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
    }),
    queryFn: () =>
      VehicleRegistrationEmployeesApi.getAll({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      }),
    select: (paged): TransformedData => {
      const rows = paged.items ?? [];
      if (!rows.length) {
        return { columnDefs: [], rowDefs: [], total: paged.total };
      }

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
    vehicleRegistrationEmployeesRows: data?.rowDefs ?? [],
    vehicleRegistrationEmployeesColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,

    paginationModel,
    setPaginationModel,

    error,
    isLoading,
    isError,
  };
};
