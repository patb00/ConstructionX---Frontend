import { Paper, Stack, Typography } from "@mui/material";
import { useAddCompany } from "../hooks/useAddCompany";
import CompanyForm from "./CompanyForm";

export default function CompanyCreatePage() {
  const { mutateAsync, isPending } = useAddCompany();
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Kreiraj tvrtku
      </Typography>
      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <CompanyForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
