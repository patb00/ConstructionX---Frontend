import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { CreateVehicleRepairRequest } from "..";
import { useVehicleRepair } from "../hooks/useVehicleRepair";
import { useUpdateVehicleRepair } from "../hooks/useUpdateVehicleRepair";
import VehicleRepairForm from "./VehicleRepairForm";
import { vehicleRepairToDefaultValues } from "../utils/vehicleRepairForm";

export default function VehicleRepairEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const repairId = Number(id);

  if (!Number.isFinite(repairId)) {
    return <div>{t("vehicleRepairs.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const { data: repair, isLoading: loadingRepair, error } =
    useVehicleRepair(repairId);

  const { mutate: updateRepair, isPending: updating } =
    useUpdateVehicleRepair();

  if (error) return <div>{t("vehicleRepairs.edit.loadError")}</div>;

  const defaultValues: CreateVehicleRepairRequest | undefined =
    vehicleRepairToDefaultValues(repair);

  const handleSubmit = (values: CreateVehicleRepairRequest) => {
    const idForUpdate =
      typeof (repair as any)?.id === "number" ? (repair as any).id : repairId;

    updateRepair({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/vehicle-repairs"),
    });
  };

  const busy = loadingRepair || updating;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleRepairs.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-repairs")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleRepairs.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleRepairForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
        />
      </Paper>
    </Stack>
  );
}
