import { Paper, Stack, Typography } from "@mui/material";
import { useAddEmployee } from "../hooks/useAddEmployee";
import EmployeeForm from "./EmployeeForm";

export default function EmployeeCreatePage() {
  const { mutateAsync, isPending } = useAddEmployee();
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Kreiraj zaposlenika
      </Typography>
      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <EmployeeForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
