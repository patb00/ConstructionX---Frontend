import { useQuery } from "@tanstack/react-query";
import { employeesKeys } from "../api/employees.keys";
import { EmployeesApi } from "../api/employees.api";
import type { Employee } from "..";
import type { GridColDef } from "@mui/x-data-grid";

interface TransformedEmployeesData {
  columnDefs: GridColDef<Employee>[];
  rowDefs: Employee[];
}

export const useEmployees = () => {
  const { data, error, isLoading, isError } = useQuery<
    Employee[],
    Error,
    TransformedEmployeesData
  >({
    queryKey: employeesKeys.list(),
    queryFn: EmployeesApi.getAll,
    select: (rows): TransformedEmployeesData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        if (key === "jobPosition") {
          return {
            field: key,
            headerName,
            width: 200,
            renderCell: (params) => params?.value?.name ?? "",
          };
        }

        return {
          field: key,
          headerName,
          width: 180,
        };
      });

      const rowDefs = rows.map((item) => ({
        ...item,
        id: item.id,
      }));
      return { columnDefs, rowDefs };
    },
  });

  return {
    employeeRows: data?.rowDefs ?? [],
    employeeColumns: data?.columnDefs ?? [],
    error,
    isLoading,
    isError,
  };
};
