import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

import { PermissionGate } from "../../../lib/permissions";
import VehicleBusinessTripsTable from "./VehicleBusinessTripsTable";

import { useVehicleBusinessTripStatusOptions } from "../../constants/enum/useVehicleBusinessTripStatusOptions";
import FilterSelect, {
  type SelectOption,
} from "../../../components/ui/select/FilterSelect";

export default function VehicleBusinessTripsListPage() {
  const { t } = useTranslation();
  const statusOptions = useVehicleBusinessTripStatusOptions();

  const [statusValue, setStatusValue] = useState<string>("");

  const selectOptions: SelectOption[] = useMemo(
    () =>
      (statusOptions ?? []).map((o) => ({
        value: String(o.value),
        label: o.label,
        dotValue: o.value,
      })),
    [statusOptions],
  );

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

      <Stack direction="row" alignItems="center">
        <FilterSelect
          label={t("vehicleBusinessTrips.status.label", "Status")}
          placeholder={t("common.all", "All")}
          options={selectOptions}
          value={statusValue}
          onChange={setStatusValue}
        />
      </Stack>

      <VehicleBusinessTripsTable statusValue={statusValue} />
    </Stack>
  );
}
