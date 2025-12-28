import { Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VehicleInsurancesTable from "./VehicleInsurancesTable";
import { PermissionGate } from "../../../lib/permissions";

export default function VehicleInsurancesListPage() {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleInsurances.list.title")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Vehicles.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("vehicleInsurances.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <VehicleInsurancesTable />
      </Paper>
    </Stack>
  );
}
