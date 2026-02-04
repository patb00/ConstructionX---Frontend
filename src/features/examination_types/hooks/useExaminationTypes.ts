import { useQuery } from "@tanstack/react-query";
import type { ExaminationType } from "..";
import type { GridColDef } from "@mui/x-data-grid";
import { examinationTypesKeys } from "../api/examination-types.keys";
import { ExaminationTypesApi } from "../api/examination-types.api";
import { useTranslation } from "react-i18next";

interface TransformedExaminationTypesData {
  columnDefs: GridColDef<ExaminationType>[];
  rowDefs: ExaminationType[];
}

export const useExaminationTypes = () => {
  const { t } = useTranslation();

  const { data, error, isLoading } = useQuery<
    ExaminationType[],
    Error,
    TransformedExaminationTypesData
  >({
    queryKey: examinationTypesKeys.list(),
    queryFn: ExaminationTypesApi.getAll,
    select: (rows): TransformedExaminationTypesData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = t(`common.columns.${key}`, {
          defaultValue: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        });

        return {
          field: key,
          headerName,
          width: key === "examinationTypeName" ? 260 : 200,
        };
      });

      const rowDefs = rows.map((r) => ({ ...r, id: r.id }));

      return { columnDefs, rowDefs };
    },
  });

  return {
    examinationTypesRows: data?.rowDefs ?? [],
    examinationTypesColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
