import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAddVehicleRepair } from "../hooks/useAddVehicleRepair";
import VehicleRepairForm from "./VehicleRepairForm";

export default function VehicleRepairCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync, isPending: creating } = useAddVehicleRepair();

  const busy = creating;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleRepairs.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-repairs")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleRepairs.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleRepairForm onSubmit={mutateAsync as any} busy={busy} />
      </Paper>
    </Stack>
  );
}
