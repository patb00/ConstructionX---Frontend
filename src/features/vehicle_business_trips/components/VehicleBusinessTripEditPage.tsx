import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { UpdateVehicleBusinessTripRequest } from "..";
import { useVehicleBusinessTrip } from "../hooks/useVehicleBusinessTrip";
import { useUpdateVehicleBusinessTrip } from "../hooks/useUpdateVehicleBusinessTrip";
import VehicleBusinessTripForm from "./VehicleBusinessTripForm";
import { vehicleBusinessTripToDefaultValues } from "../utils/vehicleBusinessTripForm";

export default function VehicleBusinessTripEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const businessTripId = Number(id);

  if (!Number.isFinite(businessTripId)) {
    return <div>{t("vehicleBusinessTrips.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: trip,
    isLoading: loadingTrip,
    error,
  } = useVehicleBusinessTrip(businessTripId);

  const { mutate: updateTrip, isPending: updating } =
    useUpdateVehicleBusinessTrip();

  if (error) return <div>{t("vehicleBusinessTrips.edit.loadError")}</div>;

  const defaultValues: UpdateVehicleBusinessTripRequest | undefined =
    vehicleBusinessTripToDefaultValues(trip);

  const handleSubmit = (
    values: Omit<UpdateVehicleBusinessTripRequest, "id">
  ) => {
    updateTrip(
      { ...values, id: businessTripId },
      { onSuccess: () => navigate("/app/vehicle-business-trips") }
    );
  };

  const busy = loadingTrip || updating;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleBusinessTrips.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-business-trips")}
        >
          {t("vehicleBusinessTrips.edit.back")}
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 2 }}>
        <VehicleBusinessTripForm
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
          showStatusField
        />
      </Paper>
    </Stack>
  );
}
