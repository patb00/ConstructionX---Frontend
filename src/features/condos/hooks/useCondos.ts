import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";

import { condosKeys } from "../api/condos.keys";
import { CondosApi } from "../api/condos.api";
import type { Condo, PagedResult } from "..";

interface TransformedCondosData {
  columnDefs: GridColDef<Condo>[];
  rowDefs: Condo[];
  total: number;
}

export const useCondos = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<Condo>,
    Error,
    TransformedCondosData
  >({
    queryKey: condosKeys.list(),
    queryFn: () =>
      CondosApi.getAll({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      }),
    select: (paged): TransformedCondosData => {
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
    condosRows: data?.rowDefs ?? [],
    condosColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
