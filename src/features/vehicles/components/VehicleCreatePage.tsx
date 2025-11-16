import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VehicleForm from "./VehicleForm";
import { useAddVehicle } from "../hooks/useAddVehicle";
import { useVehicleStatuses } from "../constants/hooks/useVehicleStatus";
import { useVehicleConditions } from "../constants/hooks/useVehicleConditions";
import { useVehicleTypes } from "../constants/hooks/useVehiclesTypes";

export default function VehicleCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useAddVehicle();

  const { data: statuses = [], isLoading: sL } = useVehicleStatuses();
  const { data: conditions = [], isLoading: cL } = useVehicleConditions();
  const { data: types = [], isLoading: tL } = useVehicleTypes();

  const toOptions = (arr: string[]) => arr.map((x) => ({ value: x, label: x }));

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicles.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicles")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicles.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleForm
          onSubmit={mutateAsync}
          busy={isPending || sL || cL || tL}
          statusOptions={toOptions(statuses)}
          conditionOptions={toOptions(conditions)}
          typeOptions={toOptions(types)}
        />
      </Paper>
    </Stack>
  );
}
