import { Button, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VehiclesTable from "./VehiclesTable";
import { PermissionGate } from "../../../lib/permissions";
import { VehiclesApi } from "../api/vehicles.api";
import { ImportExportActions } from "../../../components/ui/import-export/ImportExportActions";

export default function VehiclesListPage() {
  const { t } = useTranslation();
  const handleExport = useCallback(() => VehiclesApi.export(), []);
  const handleImport = useCallback(
    (file: File) => VehiclesApi.import(file),
    []
  );

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h5" fontWeight={600}>
            {t("vehicles.list.title")}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            exportFileName="vehicles.xlsx"
            importResultFileName="vehicles-import-result.xlsx"
          />
          <PermissionGate guard={{ permission: "Permission.Vehicles.Create" }}>
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              {t("vehicles.create.title")}
            </Button>
          </PermissionGate>
        </Stack>
      </Stack>

      <VehiclesTable />
    </Stack>
  );
}
