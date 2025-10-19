import { useQuery } from "@tanstack/react-query";

import type { GridColDef } from "@mui/x-data-grid";
import type { ToolCategory } from "..";
import { toolCategoriesKeys } from "../api/tool-category.keys";
import { ToolCategoriesApi } from "../api/tool-category.api";

interface TransformedToolCategoriesData {
  columnDefs: GridColDef<ToolCategory>[];
  rowDefs: ToolCategory[];
}

export const useToolCategories = () => {
  const { data, error, isLoading } = useQuery<
    ToolCategory[],
    Error,
    TransformedToolCategoriesData
  >({
    queryKey: toolCategoriesKeys.list(),
    queryFn: ToolCategoriesApi.getAll,
    select: (rows): TransformedToolCategoriesData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return { field: key, headerName, width: 180 };
      });

      const rowDefs = rows.map((r) => ({ ...r, id: r.id }));
      return { columnDefs, rowDefs };
    },
  });

  return {
    toolCategoriesRows: data?.rowDefs ?? [],
    toolCategoriesColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
