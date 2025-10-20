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

export default function VehicleEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const vehicleId = Number(id);
  if (!Number.isFinite(vehicleId))
    return (
      <div>
        {t("vehicles.edit.invalidUrlId", {
          defaultValue: "Invalid vehicle id",
        })}
      </div>
    );

  const navigate = useNavigate();
  const { data: vehicle, isLoading: vL, error } = useVehicle(vehicleId);
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();

  const { data: statuses = [], isLoading: sL } = useVehicleStatuses();
  const { data: conditions = [], isLoading: cL } = useVehicleConditions();
  const { data: types = [], isLoading: tL } = useVehicleTypes();
  const toOptions = (arr: string[]) => arr.map((x) => ({ value: x, label: x }));

  if (error)
    return (
      <div>
        {t("vehicles.edit.loadError", {
          defaultValue: "Failed to load vehicle",
        })}
      </div>
    );

  const defaultValues: NewVehicleRequest | undefined = vehicle && {
    name: vehicle.name ?? "",
    registrationNumber: vehicle.registrationNumber ?? null,
    vin: vehicle.vin ?? null,
    brand: vehicle.brand ?? null,
    model: vehicle.model ?? null,
    yearOfManufacturing: vehicle.yearOfManufacturing ?? null,
    vehicleType: vehicle.vehicleType ?? null,
    status: vehicle.status ?? null,
    purchaseDate: vehicle.purchaseDate ?? "",
    purchasePrice: vehicle.purchasePrice ?? 0,
    description: vehicle.description ?? null,
    condition: vehicle.condition ?? null,
    horsePower: vehicle.horsePower ?? null,
    averageConsumption: vehicle.averageConsumption ?? null,
    weight: vehicle.weight ?? null,
  };

  const handleSubmit = (values: NewVehicleRequest) => {
    const idForUpdate =
      typeof vehicle?.id === "number" ? vehicle.id : vehicleId;
    updateVehicle(
      { id: idForUpdate, ...values },
      {
        onSuccess: () => navigate("/app/vehicles"),
      }
    );
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicles.edit.title", { defaultValue: "Edit vehicle" })}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicles")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicles.edit.back", { defaultValue: "Back" })}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={vL || isPending || sL || cL || tL}
          statusOptions={toOptions(statuses)}
          conditionOptions={toOptions(conditions)}
          typeOptions={toOptions(types)}
        />
      </Paper>
    </Stack>
  );
}
