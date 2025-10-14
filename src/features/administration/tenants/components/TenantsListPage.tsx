import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import TenantsTable from "./TenantsTable";
import { PermissionGate } from "../../../../lib/permissions";

export default function TenantsListPage() {
  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
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
        <TenantsTable />
      </Paper>
    </Stack>
  );
}
