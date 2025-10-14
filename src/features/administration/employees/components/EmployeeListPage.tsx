import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EmployeesTable from "./EmployeesTable";
import { useEmployees } from "../hooks/useEmployees";
import { QueryBoundary } from "../../../../components/ui/feedback/QueryBoundary";
import { FullScreenError } from "../../../../components/ui/feedback/PageStates";
import { PermissionGate } from "../../../../lib/permissions";

const EmployeesListPage = () => {
  const { employeeColumns, employeeRows, error, isLoading } = useEmployees();

  return (
    <QueryBoundary
      isLoading={isLoading}
      error={error}
      fallbackError={
        <FullScreenError title="Neuspjelo učitavanje zaposlenika" />
      }
    >
      <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" fontWeight={600}>
            Zaposlenici
          </Typography>

          <PermissionGate guard={{ permission: "Permission.Employees.Create" }}>
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              Kreiraj zaposlenika
            </Button>
          </PermissionGate>
        </Stack>

        <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
          <EmployeesTable rows={employeeRows} columns={employeeColumns} />
        </Paper>
      </Stack>
    </QueryBoundary>
  );
};

export default EmployeesListPage;
