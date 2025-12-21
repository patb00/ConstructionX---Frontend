import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAddCondo } from "../hooks/useAddCondo";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import CondoForm from "./CondoForm";
import { toEmployeeOptions } from "../../tools/utils/options";
import { toCurrencyOptions } from "../utils/options";

export default function CondoCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync, isPending: creating } = useAddCondo();

  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();
  const employeeOptions = toEmployeeOptions(employeeRows, [
    { value: null, label: t("condos.form.responsible.none") },
  ]);

  const currencyOptions = toCurrencyOptions();

  const busy = creating || employeesLoading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("condos.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/condos")}
          sx={{ color: "primary.main" }}
        >
          {t("condos.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
          p: 2,
        }}
      >
        <CondoForm
          onSubmit={mutateAsync}
          busy={busy}
          employeeOptions={employeeOptions}
          currencyOptions={currencyOptions}
        />
      </Paper>
    </Stack>
  );
}
