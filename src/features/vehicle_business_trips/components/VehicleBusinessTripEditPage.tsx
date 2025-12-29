import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { NewVehicleBusinessTripRequest } from "..";
import { useVehicleBusinessTrip } from "../hooks/useVehicleBusinessTrip";
import { useUpdateVehicleBusinessTrip } from "../hooks/useUpdateVehicleBusinessTrip";
import VehicleBusinessTripForm from "./VehicleBusinessTripForm";
import { vehicleBusinessTripToDefaultValues } from "../utils/vehicleBusinessTripForm";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";
import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";

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

  const { options: vehicleOptions, isLoading: vehiclesLoading } =
    useVehicleOptions();

  const { options: employeeOptions, isLoading: employeesLoading } =
    useEmployeeOptions();

  if (error) return <div>{t("vehicleBusinessTrips.edit.loadError")}</div>;

  const defaultValues: NewVehicleBusinessTripRequest | undefined =
    vehicleBusinessTripToDefaultValues(trip) as any;

  const handleSubmit = (values: NewVehicleBusinessTripRequest) => {
    const idForUpdate =
      typeof (trip as any)?.id === "number" ? (trip as any).id : businessTripId;

    updateTrip(
      {
        id: idForUpdate,
        startLocationText: values.startLocationText ?? null,
        endLocationText: values.endLocationText ?? null,
        startAt: values.startAt,
        endAt: values.endAt,
        startKilometers: values.startKilometers,
        endKilometers: values.endKilometers,
        tripStatus: (trip as any)?.tripStatus ?? 1,
        refueled: values.refueled,
        fuelAmount: values.fuelAmount,
        fuelCurrency: values.fuelCurrency ?? null,
        fuelLiters: values.fuelLiters,
        note: values.note ?? null,
      } as any,
      {
        onSuccess: () => navigate("/app/vehicle-business-trips"),
      }
    );
  };

  const busy = loadingTrip || updating || vehiclesLoading || employeesLoading;

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
          sx={{ color: "primary.main" }}
        >
          {t("vehicleBusinessTrips.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleBusinessTripForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
          vehicleOptions={vehicleOptions}
          employeeOptions={employeeOptions}
        />
      </Paper>
    </Stack>
  );
}
