import { Button, Paper, Stack, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import EmployeeForm from "./EmployeeForm";
import type { EmployeeFormValues } from "..";
import { useEmployee } from "../hooks/useEmployee";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";
import { useAssignJobPosition } from "../hooks/useAssignJobPosition";
import {
  employeeToDefaultValues,
  employeeInitialJobPositionId,
} from "../utils/employeeForm";

export default function EmployeeEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);
  if (!Number.isFinite(employeeId))
    return <div>{t("employees.edit.invalidUrlId")}</div>;

  const { data: emp, isLoading, error } = useEmployee(employeeId);
  const update = useUpdateEmployee();
  const assign = useAssignJobPosition();

  const initialJobPositionId = emp ? employeeInitialJobPositionId(emp) : "";

  const handleSubmit = async (values: EmployeeFormValues) => {
    const { jobPositionId, ...employeeFields } = values;

    await update.mutateAsync({ id: employeeId, ...employeeFields });

    if (
      jobPositionId &&
      Number(jobPositionId) !== Number(initialJobPositionId || 0)
    ) {
      await assign.mutateAsync({
        employeeId,
        jobPositionId: Number(jobPositionId),
      });
    }

    navigate("/app/administration/employees");
  };

  if (error) return <div>{t("employees.edit.loadError")}</div>;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("employees.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/employees")}
          sx={{ color: "primary.main" }}
        >
          {t("employees.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <EmployeeForm
          defaultValues={emp ? employeeToDefaultValues(emp) : undefined}
          onSubmit={handleSubmit}
          busy={update.isPending || isLoading || assign.isPending}
        />
      </Paper>
    </Stack>
  );
}
