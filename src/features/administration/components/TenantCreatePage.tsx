import { Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAddTenant } from "../hooks/useAddTenant";
import type { TenantFormValues } from "./TenantForm";
import TenantForm from "./TenantForm";

export default function TenantCreatePage() {
  const nav = useNavigate();
  const { mutateAsync, isPending } = useAddTenant();

  const handleSubmit = async (v: TenantFormValues) => {
    await mutateAsync({
      ...v,
      validUpToDate: v.validUpToDate
        ? new Date(v.validUpToDate).toISOString()
        : new Date().toISOString(),
    });
    nav("..");
  };

  return (
    <Stack spacing={2}>
      {" "}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Kreiraj tenant
      </Typography>
      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <TenantForm onSubmit={handleSubmit} busy={isPending} />
      </Paper>
    </Stack>
  );
}
