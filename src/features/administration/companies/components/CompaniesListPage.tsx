import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CompaniesTable from "./CompaniesTable";
import { PermissionGate } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";

const CompaniesListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("companies.list.title")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Companies.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("companies.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <CompaniesTable />
      </Paper>
    </Stack>
  );
};

export default CompaniesListPage;
