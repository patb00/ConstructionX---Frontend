import { useQuery } from "@tanstack/react-query";
import { employeesKeys } from "../api/employees.keys";
import { EmployeesApi } from "../api/employees.api";
import type { AssignedConstructionSite } from "..";
import type { GridColDef } from "@mui/x-data-grid";

interface TransformedACSData {
  columnDefs: GridColDef<AssignedConstructionSite>[];
  rowDefs: AssignedConstructionSite[];
}

export const useAssignedConstructionSites = () => {
  const { data, error, isLoading, isError } = useQuery<
    AssignedConstructionSite[],
    Error,
    TransformedACSData
  >({
    queryKey: employeesKeys.assignedConstructionSites(),
    queryFn: EmployeesApi.getAssignedConstructionSites,
    select: (rows): TransformedACSData => {
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
        id: `${item.employeeId}-${item.constructionSiteId}-${item.dateFrom}-${item.dateTo}`,
      }));

      return { columnDefs, rowDefs };
    },
  });

  return {
    acsRows: data?.rowDefs ?? [],
    acsColumns: data?.columnDefs ?? [],
    error,
    isLoading,
    isError,
  };
};
