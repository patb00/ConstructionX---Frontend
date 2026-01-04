import { useQuery } from "@tanstack/react-query";
import { employeesKeys } from "../api/employees.keys";
import { EmployeesApi } from "../api/employees.api";
import type { AssignedTool } from "..";
import type { GridColDef } from "@mui/x-data-grid";

interface TransformedATData {
  columnDefs: GridColDef<AssignedTool>[];
  rowDefs: AssignedTool[];
}

export const useAssignedTools = () => {
  const { data, error, isLoading, isError } = useQuery<
    AssignedTool[],
    Error,
    TransformedATData
  >({
    queryKey: employeesKeys.assignedTools(),
    queryFn: EmployeesApi.getAssignedTools,
    select: (rows): TransformedATData => {
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
        id: `${item.toolId}-${item.constructionSiteId}-${item.dateFrom}-${item.responsibleEmployeeId}`,
      }));

      return { columnDefs, rowDefs };
    },
  });

  return {
    toolRows: data?.rowDefs ?? [],
    toolColumns: data?.columnDefs ?? [],
    error,
    isLoading,
    isError,
  };
};
