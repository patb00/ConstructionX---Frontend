import { Button, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";

import { PermissionGate } from "../../../lib/permissions";
import { useTranslation } from "react-i18next";
import CertificationTypesTable from "./CertificationTypesTable";
import { CertificationTypesApi } from "../api/certification-types.api";
import { ImportExportActions } from "../../../components/ui/import-export/ImportExportActions";
import { useImportCertificationTypes } from "../hooks/useImportCertificationTypes";

const CertificationTypesListPage = () => {
  const { t } = useTranslation();
  const handleExport = useCallback(() => CertificationTypesApi.export(), []);
  const handleImport = useImportCertificationTypes();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("certificationTypes.list.title")}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            exportFileName="certification-types.xlsx"
            importResultFileName="certification-types-import-result.xlsx"
          />
          <PermissionGate
            guard={{ permission: "Permission.CertificationTypes.Create" }}
          >
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              {t("certificationTypes.create.title")}
            </Button>
          </PermissionGate>
        </Stack>
      </Stack>

      <CertificationTypesTable />
    </Stack>
  );
};

export default CertificationTypesListPage;
