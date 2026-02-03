import { Button, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import EmployeesTable from "./EmployeesTable";
import { PermissionGate } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";
import { EmployeesApi } from "../api/employees.api";
import { ImportExportActions } from "../../../../components/ui/import-export/ImportExportActions";
import { useImportEmployees } from "../hooks/useImportEmployees";

const EmployeesListPage = () => {
  const { t } = useTranslation();
  const handleExport = useCallback(() => EmployeesApi.export(), []);
  const handleImport = useImportEmployees();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("employees.list.title")}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            exportFileName="employees.xlsx"
            importResultFileName="employees-import-result.xlsx"
          />
          <PermissionGate guard={{ permission: "Permission.Employees.Create" }}>
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              {t("employees.create.title")}
            </Button>
          </PermissionGate>
        </Stack>
      </Stack>

      <EmployeesTable />
    </Stack>
  );
};

export default EmployeesListPage;
