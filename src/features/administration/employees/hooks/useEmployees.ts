import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { employeesKeys } from "../api/employees.keys";
import { EmployeesApi } from "../api/employees.api";
import type { Employee, PagedResult } from "..";
import type { GridColDef } from "@mui/x-data-grid";

interface TransformedEmployeesData {
  columnDefs: GridColDef<Employee>[];
  rowDefs: Employee[];
  total: number;
}

export const useEmployees = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<Employee>,
    Error,
    TransformedEmployeesData
  >({
    queryKey: employeesKeys.list(
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      EmployeesApi.getAll(paginationModel.page + 1, paginationModel.pageSize), // backend 1-based
    select: (paged): TransformedEmployeesData => {
      const rows = paged.items ?? [];
      if (!rows.length)
        return { columnDefs: [], rowDefs: [], total: paged.total };

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

      const rowDefs = rows.map((item) => ({ ...item, id: item.id }));
      return { columnDefs, rowDefs, total: paged.total };
    },
    placeholderData: (prev) => prev,
  });

  return {
    employeeRows: data?.rowDefs ?? [],
    employeeColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
