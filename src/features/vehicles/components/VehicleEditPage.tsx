import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import VehicleForm from "./VehicleForm";
import type { NewVehicleRequest } from "..";
import { useVehicle } from "../hooks/useVehicle";
import { useUpdateVehicle } from "../hooks/useUpdateVehicles";
import { useVehicleStatuses } from "../constants/hooks/useVehicleStatus";
import { useVehicleConditions } from "../constants/hooks/useVehicleConditions";
import { useVehicleTypes } from "../constants/hooks/useVehiclesTypes";

import { toStringOptions } from "../utils/options";
import { vehicleToDefaultValues } from "../utils/vehicleForm";

export default function VehicleEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const vehicleId = Number(id);

  if (!Number.isFinite(vehicleId)) {
    return <div>{t("vehicles.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();
  const {
    data: vehicle,
    isLoading: vehicleLoading,
    error,
  } = useVehicle(vehicleId);
  const { mutate: updateVehicle, isPending: updating } = useUpdateVehicle();

  const { data: statuses = [], isLoading: statusesLoading } =
    useVehicleStatuses();
  const { data: conditions = [], isLoading: conditionsLoading } =
    useVehicleConditions();
  const { data: types = [], isLoading: typesLoading } = useVehicleTypes();

  if (error) return <div>{t("vehicles.edit.loadError")}</div>;

  const defaultValues: NewVehicleRequest | undefined =
    vehicleToDefaultValues(vehicle);

  const handleSubmit = (values: NewVehicleRequest) => {
    const idForUpdate =
      typeof (vehicle as any)?.id === "number"
        ? (vehicle as any).id
        : vehicleId;

    updateVehicle({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/vehicles"),
    });
  };

  const busy =
    vehicleLoading ||
    updating ||
    statusesLoading ||
    conditionsLoading ||
    typesLoading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicles.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicles")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicles.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
          statusOptions={toStringOptions(statuses)}
          conditionOptions={toStringOptions(conditions)}
          typeOptions={toStringOptions(types)}
        />
      </Paper>
    </Stack>
  );
}
