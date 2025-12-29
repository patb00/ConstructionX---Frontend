import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import JobPositionsTable from "./JobPositionsTable";
import { PermissionGate } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";

const JobPositionsListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("jobPositions.list.title")}
        </Typography>

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

      <JobPositionsTable />
    </Stack>
  );
};

export default JobPositionsListPage;
