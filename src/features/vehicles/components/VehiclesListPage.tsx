import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VehiclesTable from "./VehiclesTable";
import { PermissionGate } from "../../../lib/permissions";

export default function VehiclesListPage() {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h5" fontWeight={600}>
            {t("vehicles.list.title")}
          </Typography>
        </Stack>

        <PermissionGate guard={{ permission: "Permission.Vehicles.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("vehicles.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <VehiclesTable />
    </Stack>
  );
}
