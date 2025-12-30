import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import VehicleBusinessTripForm from "./VehicleBusinessTripForm";
import { useAddVehicleBusinessTrip } from "../hooks/useAddVehicleBusinessTrip";

export default function VehicleBusinessTripCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync, isPending: creating } = useAddVehicleBusinessTrip();

  const handleSubmit = async (values: any) => {
    await mutateAsync(values);
    navigate("/app/vehicle-business-trips");
  };

  const busy = creating;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleBusinessTrips.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-business-trips")}
        >
          {t("vehicleBusinessTrips.create.back")}
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 2 }}>
        <VehicleBusinessTripForm
          mode="create"
          onSubmit={handleSubmit}
          busy={busy}
          showStatusField={false}
        />
      </Paper>
    </Stack>
  );
}
