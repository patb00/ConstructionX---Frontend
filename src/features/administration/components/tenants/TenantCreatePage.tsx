import { Paper, Stack, Typography } from "@mui/material";
import { useAddTenant } from "../../hooks/tenants/useAddTenant";
import TenantForm from "./TenantForm";

export default function TenantCreatePage() {
  const { mutateAsync, isPending } = useAddTenant();

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Kreiraj tenanta
      </Typography>
      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <TenantForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
