import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import UsersTable from "./UsersTable";
import { useUsers } from "../hooks/useUsers";
import { QueryBoundary } from "../../../../components/ui/feedback/QueryBoundary";
import { FullScreenError } from "../../../../components/ui/feedback/PageStates";
import { PermissionGate } from "../../../../lib/permissions";

const UsersListPage = () => {
  const { usersColumns, usersRows, error, isLoading } = useUsers();

  return (
    <QueryBoundary
      isLoading={isLoading}
      error={error}
      fallbackError={<FullScreenError title="Neuspjelo učitavanje korisnika" />}
    >
      <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" fontWeight={600}>
            Korisnici
          </Typography>

          <PermissionGate guard={{ permission: "Permission.Users.Create" }}>
            <Button
              size="small"
              component={RouterLink}
              to="create"
              variant="contained"
            >
              Kreiraj korisnika
            </Button>
          </PermissionGate>
        </Stack>

        <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
          <UsersTable rows={usersRows} columns={usersColumns} />
        </Paper>
      </Stack>
    </QueryBoundary>
  );
};

export default UsersListPage;
