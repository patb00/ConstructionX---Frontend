import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { QueryBoundary } from "../../../../components/ui/feedback/QueryBoundary";
import { FullScreenError } from "../../../../components/ui/feedback/PageStates";
import { PermissionGate } from "../../../../lib/permissions";
import { useTenants } from "../hooks/useTenants";
import TenantsTable from "./TenantsTable";

export default function TenantsListPage() {
  const { isLoading, error, tenantsRows, tenantsColumns } = useTenants();

  return (
    <QueryBoundary
      isLoading={isLoading}
      error={error}
      fallbackError={<FullScreenError title="Neuspjelo učitavanje tenanta" />}
    >
      <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" fontWeight={600}>
            Tenanti
          </Typography>

          <PermissionGate guard={{ permission: "Permission.Tenants.Create" }}>
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              Kreiraj tenanta
            </Button>
          </PermissionGate>
        </Stack>

        <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
          <TenantsTable rows={tenantsRows} columns={tenantsColumns} />
        </Paper>
      </Stack>
    </QueryBoundary>
  );
}
