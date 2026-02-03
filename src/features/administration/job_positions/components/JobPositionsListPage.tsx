import { Button, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import JobPositionsTable from "./JobPositionsTable";
import { PermissionGate } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";
import { JobPositionsApi } from "../api/job-positions.api";
import { ImportExportActions } from "../../../../components/ui/import-export/ImportExportActions";

const JobPositionsListPage = () => {
  const { t } = useTranslation();
  const handleExport = useCallback(() => JobPositionsApi.export(), []);
  const handleImport = useCallback(
    (file: File) => JobPositionsApi.import(file),
    []
  );

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("jobPositions.list.title")}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            exportFileName="job-positions.xlsx"
            importResultFileName="job-positions-import-result.xlsx"
          />
          <PermissionGate
            guard={{ permission: "Permission.JobPositions.Create" }}
          >
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              {t("jobPositions.create.title")}
            </Button>
          </PermissionGate>
        </Stack>
      </Stack>

      <JobPositionsTable />
    </Stack>
  );
};

export default JobPositionsListPage;
