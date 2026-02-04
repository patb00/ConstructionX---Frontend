// src/features/vehicleRepairs/pages/VehicleRepairsListPage.tsx
import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PermissionGate } from "../../../lib/permissions";
import VehicleRepairsTable from "../components/VehicleRepairsTable";

export default function VehicleRepairsListPage() {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleRepairs.list.title")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Vehicles.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("vehicleRepairs.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <VehicleRepairsTable />
    </Stack>
  );
}
