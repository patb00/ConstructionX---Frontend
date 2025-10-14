import { useParams } from "react-router-dom";
import { Paper, Stack, Typography } from "@mui/material";
import { useTenant } from "../hooks/useTenant";

export default function TenantDetailsPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { data, isLoading, error } = useTenant(tenantId);

  console.log("data", data);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        {data?.name}
      </Typography>
      <Paper
        elevation={0}
        sx={{ p: 2, border: (t) => `1px solid ${t.palette.divider}` }}
      >
        {isLoading && <Typography>Loading…</Typography>}
        {error && <Typography color="error">Neuspjelo učitavanje.</Typography>}
        {data && (
          <>
            <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
          </>
        )}
      </Paper>
    </Stack>
  );
}
