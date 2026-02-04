import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { VehicleInsurance, PagedResult } from "..";
import { vehicleInsurancesKeys } from "../api/vehicle-insurance.keys";
import { VehicleInsurancesApi } from "../api/vehicle-insurance.api";

interface TransformedData {
  columnDefs: GridColDef<VehicleInsurance>[];
  rowDefs: VehicleInsurance[];
  total: number;
}

export const useVehicleInsurances = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<VehicleInsurance>,
    Error,
    TransformedData
  >({
    queryKey: vehicleInsurancesKeys.list(
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      VehicleInsurancesApi.getAll(
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
    vehicleInsurancesRows: data?.rowDefs ?? [],
    vehicleInsurancesColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
