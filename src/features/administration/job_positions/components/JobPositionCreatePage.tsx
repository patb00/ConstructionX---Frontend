import { Paper, Stack, Typography } from "@mui/material";
import { useAddJobPosition } from "../hooks/useAddJobPosition";
import JobPositionForm from "./JobPositionForm";

export default function JobPositionCreatePage() {
  const { mutateAsync, isPending } = useAddJobPosition();
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Kreiraj radno mjesto
      </Typography>
      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <JobPositionForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
