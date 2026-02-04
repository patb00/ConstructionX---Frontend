import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { MedicalExamination, PagedResult } from "..";
import { medicalExaminationsKeys } from "../api/medical-examinations.keys";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";
import { useTranslation } from "react-i18next";

interface TransformedMedicalExaminationsData {
  columnDefs: GridColDef<MedicalExamination>[];
  rowDefs: MedicalExamination[];
  total: number;
}

export const useMedicalExaminations = () => {
  const { t } = useTranslation();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<MedicalExamination>,
    Error,
    TransformedMedicalExaminationsData
  >({
    queryKey: medicalExaminationsKeys.list(
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      MedicalExaminationsApi.getAll(
        paginationModel.page + 1,
        paginationModel.pageSize
      ),
    select: (paged): TransformedMedicalExaminationsData => {
      const rows = paged.items ?? [];
      if (!rows.length)
        return { columnDefs: [], rowDefs: [], total: paged.total };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = t(`common.columns.${key}`, {
          defaultValue: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        });

        if (key === "examinationDate" || key === "nextExaminationDate") {
          return { field: key, headerName, width: 200 };
        }

        return { field: key, headerName, width: 180 };
      });

      const rowDefs = rows.map((r) => ({ ...r, id: (r as any).id }));

      return { columnDefs, rowDefs, total: paged.total };
    },
    placeholderData: (prev) => prev,
  });

  return {
    medicalExaminationsRows: data?.rowDefs ?? [],
    medicalExaminationsColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
