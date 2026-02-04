import { Button, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { PermissionGate } from "../../../lib/permissions";
import CondosTable from "./CondosTable";
import { CondosApi } from "../api/condos.api";
import { ImportExportActions } from "../../../components/ui/import-export/ImportExportActions";
import { useImportCondos } from "../hooks/useImportCondos";

const CondosListPage = () => {
  const { t } = useTranslation();
  const handleExport = useCallback(() => CondosApi.export(), []);
  const handleImport = useImportCondos();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("condos.list.title")}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            exportFileName="condos.xlsx"
            importResultFileName="condos-import-result.xlsx"
          />
          <PermissionGate guard={{ permission: "Permission.Condos.Create" }}>
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              {t("condos.create.title")}
            </Button>
          </PermissionGate>
        </Stack>
      </Stack>

      <CondosTable />
    </Stack>
  );
};

export default CondosListPage;
