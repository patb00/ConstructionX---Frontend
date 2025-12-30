import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { NewVehicleInsuranceRequest } from "..";
import { useVehicleInsurance } from "../hooks/useVehicleInsurance";
import { useUpdateVehicleInsurance } from "../hooks/useUpdateVehicleInsurance";
import VehicleInsuranceForm from "./VehicleInsuranceForm";
import { vehicleInsuranceToDefaultValues } from "../utils/vehicleInsuranceForm";

export default function VehicleInsuranceEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const insuranceId = Number(id);

  if (!Number.isFinite(insuranceId)) {
    return <div>{t("vehicleInsurances.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: insurance,
    isLoading: loadingInsurance,
    error,
  } = useVehicleInsurance(insuranceId);

  const { mutate: updateInsurance, isPending: updating } =
    useUpdateVehicleInsurance();

  if (error) return <div>{t("vehicleInsurances.edit.loadError")}</div>;

  const defaultValues: NewVehicleInsuranceRequest | undefined =
    vehicleInsuranceToDefaultValues(insurance) as any;

  const handleSubmit = (values: NewVehicleInsuranceRequest) => {
    const idForUpdate =
      typeof (insurance as any)?.id === "number"
        ? (insurance as any).id
        : insuranceId;

    updateInsurance({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/vehicle-insurances"),
    });
  };

  const busy = loadingInsurance || updating;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleInsurances.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-insurances")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleInsurances.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleInsuranceForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
        />
      </Paper>
    </Stack>
  );
}
