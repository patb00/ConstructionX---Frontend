import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";

import { PermissionGate } from "../../../lib/permissions";
import MedicalExaminationsTable from "./MedicalExaminationTable";
import { useExaminationTypes } from "../../examination_types/hooks/useExaminationTypes";
import FilterSelect, {
  type SelectOption,
} from "../../../components/ui/select/FilterSelect";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";
import { ImportExportActions } from "../../../components/ui/import-export/ImportExportActions";
import { useImportMedicalExaminations } from "../hooks/useImportMedicalExaminations";

type FilterValue = "all" | "byEmployee" | number;

const MedicalExaminationsListPage = () => {
  const { t } = useTranslation();
  const { examinationTypesRows, isLoading: typesLoading } =
    useExaminationTypes();

  const [filter, setFilter] = useState<FilterValue>("all");

  const isByEmployee = filter === "byEmployee";

  const selectedExaminationTypeId = useMemo(() => {
    if (filter === "all" || filter === "byEmployee") return null;
    return filter;
  }, [filter]);

  const handleExport = useCallback(() => MedicalExaminationsApi.export(), []);
  const handleImport = useImportMedicalExaminations();

  const selectValue = useMemo(() => {
    if (filter === "all") return "";
    if (filter === "byEmployee") return "byEmployee";
    return String(filter);
  }, [filter]);

  const options: SelectOption[] = useMemo(
    () => [
      {
        value: "byEmployee",
        label: t("employees.byEmployee", "By employee"),
      },
      ...(examinationTypesRows ?? []).map((x: any) => ({
        value: String(x.id),
        label: x.examinationTypeName ?? String(x.id),
        disabled: typesLoading,
      })),
    ],
    [examinationTypesRows, t, typesLoading]
  );

  const handleChange = (value: string) => {
    if (!value) {
      setFilter("all");
      return;
    }

    if (value === "byEmployee") {
      setFilter("byEmployee");
      return;
    }

    const id = Number(value);
    if (!Number.isNaN(id)) {
      setFilter(id);
    }
  };

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("medicalExaminations.list.title")}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            exportFileName="medical-examinations.xlsx"
            importResultFileName="medical-examinations-import-result.xlsx"
          />
          <PermissionGate
            guard={{ permission: "Permission.MedicalExaminations.Create" }}
          >
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              {t("medicalExaminations.create.title")}
            </Button>
          </PermissionGate>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center">
        <FilterSelect
          label={t("common.filter", "Filter")}
          placeholder={t("common.allTypes", "All types")}
          options={options}
          value={selectValue}
          onChange={handleChange}
          disabled={typesLoading}
          showDotInValue={false}
          showDotInMenu={false}
        />
      </Stack>

      <MedicalExaminationsTable
        examinationTypeId={selectedExaminationTypeId}
        groupByEmployee={isByEmployee}
      />
    </Stack>
  );
};

export default MedicalExaminationsListPage;
