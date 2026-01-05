import { useQuery } from "@tanstack/react-query";
import type { Certification } from "..";
import type { GridColDef } from "@mui/x-data-grid";
import { certificationsKeys } from "../api/certifications.keys";
import { CertificationsApi } from "../api/certifications.api";
import { useTranslation } from "react-i18next";

const CLIENT_PAGE_SIZE = 1000;

interface TransformedCertificationsData {
  columnDefs: GridColDef<Certification>[];
  rowDefs: Certification[];
}

export const useCertificationsByCertificationType = (
  certificationTypeId: number
) => {
  const { t } = useTranslation();

  const { data, error, isLoading } = useQuery<
    Certification[],
    Error,
    TransformedCertificationsData
  >({
    queryKey: certificationsKeys.byCertificationType(certificationTypeId),
    queryFn: async () => {
      const response = await CertificationsApi.getAll(1, CLIENT_PAGE_SIZE);
      return (response.items ?? []).filter(
        (row) => row.certificationTypeId === certificationTypeId
      );
    },
    enabled: !!certificationTypeId,
    select: (rows): TransformedCertificationsData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

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
          return {
            field: key,
            headerName,
            width: 200,
          };
        }

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
    certificationsRows: data?.rowDefs ?? [],
    certificationsColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
