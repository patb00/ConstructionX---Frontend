import { useQuery } from "@tanstack/react-query";
import type { CertificationType } from "..";
import type { GridColDef } from "@mui/x-data-grid";
import { certificationTypesKeys } from "../api/certification-types.keys";
import { CertificationTypesApi } from "../api/certification-types.api";
import { useTranslation } from "react-i18next";

interface TransformedCertificationTypesData {
  columnDefs: GridColDef<CertificationType>[];
  rowDefs: CertificationType[];
}

export const useCertificationTypes = () => {
  const { t } = useTranslation();

  const { data, error, isLoading } = useQuery<
    CertificationType[],
    Error,
    TransformedCertificationTypesData
  >({
    queryKey: certificationTypesKeys.list(),
    queryFn: CertificationTypesApi.getAll,
    select: (rows): TransformedCertificationTypesData => {
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
          width: key === "certificationTypeName" ? 260 : 200,
        };
      });

      const rowDefs = rows.map((r) => ({ ...r, id: r.id }));

      return { columnDefs, rowDefs };
    },
  });

  return {
    certificationTypesRows: data?.rowDefs ?? [],
    certificationTypesColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
