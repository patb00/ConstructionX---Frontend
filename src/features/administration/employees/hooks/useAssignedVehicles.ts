// useAssignedVehicles.ts
import { useQuery } from "@tanstack/react-query";
import { employeesKeys } from "../api/employees.keys";
import { EmployeesApi } from "../api/employees.api";
import type { AssignedVehicle } from "..";
import type { GridColDef } from "@mui/x-data-grid";

interface TransformedAVData {
  columnDefs: GridColDef<AssignedVehicle>[];
  rowDefs: AssignedVehicle[];
}

export const useAssignedVehicles = () => {
  const { data, error, isLoading, isError } = useQuery<
    AssignedVehicle[],
    Error,
    TransformedAVData
  >({
    queryKey: employeesKeys.assignedVehicles(),
    queryFn: EmployeesApi.getAssignedVehicles,
    select: (rows): TransformedAVData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return {
          field: key,
          headerName,
          width: 200,
        };
      });

      const rowDefs = rows.map((item) => ({
        ...item,
        id: `${item.vehicleId}-${item.constructionSiteId}-${item.dateFrom}-${item.responsibleEmployeeId}`,
      }));

      return { columnDefs, rowDefs };
    },
  });

  return {
    vehicleRows: data?.rowDefs ?? [],
    vehicleColumns: data?.columnDefs ?? [],
    error,
    isLoading,
    isError,
  };
};
