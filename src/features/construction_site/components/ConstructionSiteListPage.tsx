import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ConstructionSitesTable from "./ConstructionSitesTable";
import { PermissionGate } from "../../../lib/permissions";

const ConstructionSitesListPage = () => {
  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          Gradilišta
        </Typography>

        <PermissionGate
          guard={{ permission: "Permission.ConstructionSites.Create" }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            Kreiraj gradilište
          </Button>
        </PermissionGate>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <ConstructionSitesTable />
      </Paper>
    </Stack>
  );
};

export default ConstructionSitesListPage;
