import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import RolesTable from "./RolesTable";
import { useRoles } from "../hooks/useRoles";

import { PermissionGate } from "../../../../lib/permissions";

const RoleslListPage = () => {
  const { rolesColumns, rolesRows } = useRoles();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          Uloge
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Roles.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            Kreiraj ulogu
          </Button>
        </PermissionGate>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <RolesTable rows={rolesRows} columns={rolesColumns} />
      </Paper>
    </Stack>
  );
};

export default RoleslListPage;
