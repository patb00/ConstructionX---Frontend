import { Button, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import ToolsTable from "./ToolsTable";
import { useTranslation } from "react-i18next";
import { PermissionGate } from "../../../lib/permissions";
import { ToolsApi } from "../api/tools.api";
import { ImportExportActions } from "../../../components/ui/import-export/ImportExportActions";
import { useImportTools } from "../hooks/useImportTools";

const ToolsListPage = () => {
  const { t } = useTranslation();
  const handleExport = useCallback(() => ToolsApi.export(), []);
  const handleImport = useImportTools();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("tools.list.title")}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            exportFileName="tools.xlsx"
            importResultFileName="tools-import-result.xlsx"
          />
          <PermissionGate guard={{ permission: "Permission.Tools.Create" }}>
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              {t("tools.create.title")}
            </Button>
          </PermissionGate>
        </Stack>
      </Stack>

      <ToolsTable />
    </Stack>
  );
};

export default ToolsListPage;
