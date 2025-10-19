import { Button, Paper, Stack, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";
import { useEmployee } from "../hooks/useEmployee";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { EmployeeFormValues } from "..";
import { useAssignJobPosition } from "../hooks/useAssignJobPosition";
import { useTranslation } from "react-i18next";

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

  const toYMD = (s?: string | null) => (s ? s.slice(0, 10) : undefined);

  const initialJobPositionId =
    (emp as any)?.jobPositionId ?? (emp as any)?.jobPosition?.id ?? "";

  const rawJobPositionId =
    (emp as any)?.jobPositionId ?? (emp as any)?.jobPosition?.id ?? undefined;

  const normalizedJobPositionId: number | "" =
    rawJobPositionId == null || rawJobPositionId === ""
      ? ""
      : typeof rawJobPositionId === "number"
      ? rawJobPositionId
      : Number(rawJobPositionId);

  const defaultValues = emp && {
    firstName: emp.firstName,
    lastName: emp.lastName,
    oib: emp.oib,
    dateOfBirth: toYMD(emp.dateOfBirth),
    employmentDate: toYMD(emp.employmentDate),
    terminationDate: toYMD(emp.terminationDate),
    hasMachineryLicense: !!emp.hasMachineryLicense,
    clothingSize: emp.clothingSize ?? "",
    gloveSize: emp.gloveSize ?? "",
    shoeSize:
      typeof emp.shoeSize === "number"
        ? emp.shoeSize
        : ("" as unknown as number),
    jobPositionId: normalizedJobPositionId,
  };

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
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={update.isPending || isLoading || assign.isPending}
        />
      </Paper>
    </Stack>
  );
}
