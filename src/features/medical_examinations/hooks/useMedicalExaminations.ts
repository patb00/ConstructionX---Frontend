import { useQuery } from "@tanstack/react-query";
import type { MedicalExamination } from "..";
import type { GridColDef } from "@mui/x-data-grid";
import { medicalExaminationsKeys } from "../api/medical-examinations.keys";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";
import { useTranslation } from "react-i18next";

interface TransformedMedicalExaminationsData {
  columnDefs: GridColDef<MedicalExamination>[];
  rowDefs: MedicalExamination[];
}

export const useMedicalExaminations = () => {
  const { t } = useTranslation();

  const { data, error, isLoading } = useQuery<
    MedicalExamination[],
    Error,
    TransformedMedicalExaminationsData
  >({
    queryKey: medicalExaminationsKeys.list(),
    queryFn: MedicalExaminationsApi.getAll,
    select: (rows): TransformedMedicalExaminationsData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = t(`common.columns.${key}`, {
          defaultValue: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        });

        if (key === "examinationDate" || key === "nextExaminationDate") {
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
    medicalExaminationsRows: data?.rowDefs ?? [],
    medicalExaminationsColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
