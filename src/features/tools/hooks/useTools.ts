import { useQuery } from "@tanstack/react-query";

import type { GridColDef } from "@mui/x-data-grid";
import { toolsKeys } from "../api/tools.keys";
import { ToolsApi } from "../api/tools.api";
import type { Tool } from "..";

interface TransformedToolsData {
  columnDefs: GridColDef<Tool>[];
  rowDefs: Tool[];
}

export const useTools = () => {
  const { data, error, isLoading } = useQuery<
    Tool[],
    Error,
    TransformedToolsData
  >({
    queryKey: toolsKeys.list(),
    queryFn: ToolsApi.getAll,
    select: (rows): TransformedToolsData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

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
      return { columnDefs, rowDefs };
    },
  });

  return {
    toolsRows: data?.rowDefs ?? [],
    toolsColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
