import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { ToolRepair, PagedResult } from "..";
import { toolRepairsKeys } from "../api/tools-repairs.keys";
import { ToolRepairsApi } from "../api/tools-repairs.api";

interface TransformedToolRepairsData {
  columnDefs: GridColDef<ToolRepair>[];
  rowDefs: ToolRepair[];
  total: number;
}

export const useToolRepairs = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<ToolRepair>,
    Error,
    TransformedToolRepairsData
  >({
    queryKey: toolRepairsKeys.list(
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      ToolRepairsApi.getAll(paginationModel.page + 1, paginationModel.pageSize),
    select: (paged): TransformedToolRepairsData => {
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
    toolRepairsRows: data?.rowDefs ?? [],
    toolRepairsColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
