import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAddVehicleRegistration } from "../hooks/useAddVehicleRegistration";
import VehicleRegistrationForm from "./VehicleRegistrationForm";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";

export default function VehicleRegistrationCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync, isPending: creating } = useAddVehicleRegistration();
  const { options: vehicleOptions, isLoading: vehiclesLoading } =
    useVehicleOptions();

  const busy = creating || vehiclesLoading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleRegistrations.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-registrations")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleRegistrations.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleRegistrationForm
          onSubmit={mutateAsync as any}
          busy={busy}
          vehicleOptions={vehicleOptions}
        />
      </Paper>
    </Stack>
  );
}
