import { Button, Paper, Stack, Typography } from "@mui/material";
import { useAddEmployee } from "../hooks/useAddEmployee";
import EmployeeForm from "./EmployeeForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import type { EmployeeFormValues } from "..";
import { useAssignJobPosition } from "../hooks/useAssignJobPosition";

export default function EmployeeCreatePage() {
  const navigate = useNavigate();

  const add = useAddEmployee();
  const assign = useAssignJobPosition();

  const handleSubmit = async (values: EmployeeFormValues) => {
    const { jobPositionId, ...employeePayload } = values;

    const addRes = await add.mutateAsync(employeePayload);
    const newEmployeeId = Number(addRes.data);

    if (jobPositionId) {
      await assign.mutateAsync({
        employeeId: newEmployeeId,
        jobPositionId: Number(jobPositionId),
      });
    }

    navigate("/app/administration/employees");
  };

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          Kreiraj zaposlenika
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/employees")}
          sx={{ color: "primary.main" }}
        >
          Natrag
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
          onSubmit={handleSubmit}
          busy={add.isPending || assign.isPending}
        />
      </Paper>
    </Stack>
  );
}
