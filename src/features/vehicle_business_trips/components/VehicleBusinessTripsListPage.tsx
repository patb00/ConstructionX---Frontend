import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VehicleBusinessTripsTable from "./VehicleBusinessTripsTable";
import { PermissionGate } from "../../../lib/permissions";

export default function VehicleBusinessTripsListPage() {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleBusinessTrips.list.title")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Vehicles.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("vehicleBusinessTrips.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <VehicleBusinessTripsTable />
    </Stack>
  );
}
