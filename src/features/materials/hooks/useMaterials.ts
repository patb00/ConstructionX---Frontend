import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { materialsKeys } from "../api/materials.keys";
import { MaterialsApi } from "../api/materials.api";
import type { PagedResult, Material } from "..";

interface TransformedMaterialsData {
  columnDefs: GridColDef<Material>[];
  rowDefs: Material[];
  total: number;
}

export const useMaterials = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<Material>,
    Error,
    TransformedMaterialsData
  >({
    queryKey: materialsKeys.list(paginationModel.page, paginationModel.pageSize),
    queryFn: () =>
      MaterialsApi.getAll(paginationModel.page + 1, paginationModel.pageSize),
    select: (paged): TransformedMaterialsData => {
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
    materialsRows: data?.rowDefs ?? [],
    materialsColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
