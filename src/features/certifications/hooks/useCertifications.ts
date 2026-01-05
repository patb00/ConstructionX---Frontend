import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { Certification, PagedResult } from "..";
import { certificationsKeys } from "../api/certifications.keys";
import { CertificationsApi } from "../api/certifications.api";
import { useTranslation } from "react-i18next";

interface TransformedCertificationsData {
  columnDefs: GridColDef<Certification>[];
  rowDefs: Certification[];
  total: number;
}

export const useCertifications = () => {
  const { t } = useTranslation();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, error, isLoading, isError } = useQuery<
    PagedResult<Certification>,
    Error,
    TransformedCertificationsData
  >({
    queryKey: certificationsKeys.list(
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      CertificationsApi.getAll(
        paginationModel.page + 1,
        paginationModel.pageSize
      ),
    select: (paged): TransformedCertificationsData => {
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

        if (
          key === "certificationDate" ||
          key === "nextCertificationDate" ||
          key === "reminderSentDate"
        ) {
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
    certificationsRows: data?.rowDefs ?? [],
    certificationsColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
    isError,
  };
};
