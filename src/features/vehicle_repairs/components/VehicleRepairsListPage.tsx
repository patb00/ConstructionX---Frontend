import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import VehicleRepairsTable from "./VehicleRepairsTable";

export default function VehicleRepairsListPage() {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h5" fontWeight={600}>
        {t("vehicleRepairs.list.title", {
          defaultValue: "Vehicle Repairs",
        })}
      </Typography>
      <VehicleRepairsTable />
    </Stack>
  );
}
