import { Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VehiclesTable from "./VehiclesTable";
import { PermissionGate } from "../../../lib/permissions";

export default function VehiclesListPage() {
  const { t } = useTranslation();
  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicles.list.title", { defaultValue: "Vehicles" })}
        </Typography>
        <PermissionGate guard={{ permission: "Permission.Vehicles.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("vehicles.create.title", { defaultValue: "Add vehicle" })}
          </Button>
        </PermissionGate>
      </Stack>
      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <VehiclesTable />
      </Paper>
    </Stack>
  );
}
