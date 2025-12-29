import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import VehicleBusinessTripForm from "./VehicleBusinessTripForm";
import { useAddVehicleBusinessTrip } from "../hooks/useAddVehicleBusinessTrip";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";
import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";

export default function VehicleBusinessTripCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync, isPending: creating } = useAddVehicleBusinessTrip();

  const { options: vehicleOptions, isLoading: vehiclesLoading } =
    useVehicleOptions();

  const { options: employeeOptions, isLoading: employeesLoading } =
    useEmployeeOptions();

  const busy = creating || vehiclesLoading || employeesLoading;

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
          sx={{ color: "primary.main" }}
        >
          {t("vehicleBusinessTrips.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleBusinessTripForm
          onSubmit={mutateAsync as any}
          busy={busy}
          vehicleOptions={vehicleOptions}
          employeeOptions={employeeOptions}
        />
      </Paper>
    </Stack>
  );
}
