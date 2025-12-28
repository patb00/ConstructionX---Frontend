import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { NewVehicleRegistrationRequest } from "..";
import { useVehicleRegistration } from "../hooks/useVehicleRegistration";
import { useUpdateVehicleRegistration } from "../hooks/useUpdateVehicleRegistration";
import { vehicleRegistrationToDefaultValues } from "../utils/vehcileRegistrationForm";
import VehicleRegistrationForm from "./VehicleRegistrationForm";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";

export default function VehicleRegistrationEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const registrationId = Number(id);

  if (!Number.isFinite(registrationId)) {
    return <div>{t("vehicleRegistrations.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: registration,
    isLoading: loadingRegistration,
    error,
  } = useVehicleRegistration(registrationId);

  const { options: vehicleOptions, isLoading: vehiclesLoading } =
    useVehicleOptions();

  const { mutate: updateRegistration, isPending: updating } =
    useUpdateVehicleRegistration();

  if (error) return <div>{t("vehicleRegistrations.edit.loadError")}</div>;

  const defaultValues: NewVehicleRegistrationRequest | undefined =
    vehicleRegistrationToDefaultValues(registration);

  const handleSubmit = (values: NewVehicleRegistrationRequest) => {
    const idForUpdate =
      typeof (registration as any)?.id === "number"
        ? (registration as any).id
        : registrationId;

    updateRegistration({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/vehicle-registrations"),
    });
  };

  const busy = loadingRegistration || updating || vehiclesLoading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleRegistrations.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-registrations")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleRegistrations.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleRegistrationForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
          vehicleOptions={vehicleOptions}
        />
      </Paper>
    </Stack>
  );
}
