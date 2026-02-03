import { Button, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";

import { PermissionGate } from "../../../lib/permissions";
import { useTranslation } from "react-i18next";
import ExaminationTypesTable from "./ExaminationTypesTable";
import { ExaminationTypesApi } from "../api/examination-types.api";
import { ImportExportActions } from "../../../components/ui/import-export/ImportExportActions";
import { useImportExaminationTypes } from "../hooks/useImportExaminationTypes";

const ExaminationTypesListPage = () => {
  const { t } = useTranslation();
  const handleExport = useCallback(() => ExaminationTypesApi.export(), []);
  const handleImport = useImportExaminationTypes();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("examinationTypes.list.title")}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            exportFileName="examination-types.xlsx"
            importResultFileName="examination-types-import-result.xlsx"
          />
          <PermissionGate
            guard={{ permission: "Permission.ExaminationTypes.Create" }}
          >
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              {t("examinationTypes.create.title")}
            </Button>
          </PermissionGate>
        </Stack>
      </Stack>

      <ExaminationTypesTable />
    </Stack>
  );
};

export default ExaminationTypesListPage;
