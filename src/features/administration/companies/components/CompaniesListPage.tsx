import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useCompanies } from "../hooks/useCompanies";
import CompaniesTable from "./CompaniesTable";
/* import { QueryBoundary } from "../../../../components/ui/feedback/QueryBoundary";
import { FullScreenError } from "../../../../components/ui/feedback/PageStates"; */
import { PermissionGate } from "../../../../lib/permissions";

const CompaniesListPage = () => {
  const { companiesColumns, companiesRows /* error, isLoading */ } =
    useCompanies();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          Tvrtke
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Companies.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            Kreiraj tvrtku
          </Button>
        </PermissionGate>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <CompaniesTable rows={companiesRows} columns={companiesColumns} />
      </Paper>
    </Stack>
  );
};

export default CompaniesListPage;
