import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import VehicleForm from "./VehicleForm";
import { useAddVehicle } from "../hooks/useAddVehicle";
import { useVehicleStatuses } from "../constants/hooks/useVehicleStatus";
import { useVehicleConditions } from "../constants/hooks/useVehicleConditions";
import { useVehicleTypes } from "../constants/hooks/useVehiclesTypes";
import { toStringOptions } from "../utils/options";

export default function VehicleCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync, isPending: creating } = useAddVehicle();

  const { data: statuses = [], isLoading: statusesLoading } =
    useVehicleStatuses();
  const { data: conditions = [], isLoading: conditionsLoading } =
    useVehicleConditions();
  const { data: types = [], isLoading: typesLoading } = useVehicleTypes();

  const busy = creating || statusesLoading || conditionsLoading || typesLoading;

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
          busy={busy}
          statusOptions={toStringOptions(statuses)}
          conditionOptions={toStringOptions(conditions)}
          typeOptions={toStringOptions(types)}
        />
      </Paper>
    </Stack>
  );
}
