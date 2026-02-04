import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { toolsKeys } from "../api/tools.keys";
import { ToolsApi } from "../api/tools.api";
import type { PagedResult, Tool } from "..";

interface TransformedToolsData {
  columnDefs: GridColDef<Tool>[];
  rowDefs: Tool[];
  total: number;
}

export const useTools = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<Tool>,
    Error,
    TransformedToolsData
  >({
    queryKey: toolsKeys.list(paginationModel.page, paginationModel.pageSize),
    queryFn: () =>
      ToolsApi.getAll(paginationModel.page + 1, paginationModel.pageSize),
    select: (paged): TransformedToolsData => {
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

      const rowDefs = rows.map((r) => ({ ...r, id: r.id }));
      return { columnDefs, rowDefs, total: paged.total };
    },
    placeholderData: (prev) => prev,
  });

  return {
    toolsRows: data?.rowDefs ?? [],
    toolsColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
