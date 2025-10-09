import { Paper, Stack, Typography, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTenant } from "../hooks/useTenant";
import { useUpdateSubscription } from "../hooks/useUpdateSubscription";

const pad = (n: number) => String(n).padStart(2, "0");
function isoToLocalInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
function localInputToIso(local: string): string {
  return new Date(local).toISOString();
}

export default function TenantEditPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  if (!tenantId) return <div>Neispravan URL (tenantId)</div>;

  const navigate = useNavigate();
  const { data: tenant, isLoading, error } = useTenant(tenantId);
  const { mutateAsync: updateSubscription, isPending } =
    useUpdateSubscription();

  const initialValue = useMemo(
    () => isoToLocalInput(tenant?.validUpToDate ?? null),
    [tenant?.validUpToDate]
  );
  const [newExpirationLocal, setNewExpirationLocal] = useState<string>("");

  const effectiveLocal = newExpirationLocal || initialValue;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveLocal) return;
    await updateSubscription({
      tenantId,
      newExpirationDate: localInputToIso(effectiveLocal),
    });
  };

  if (error) return <div>Failed to load tenant.</div>;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          Uredi pretplatu tenanta
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/tenants")}
          sx={{
            color: "primary.main",
          }}
        >
          Natrag
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          p: 2,
          width: "100%",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="subtitle1">
              Tenant: <strong>{tenant?.name}</strong> ({tenantId})
            </Typography>

            <TextField
              label="Vrijedi do"
              type="datetime-local"
              value={effectiveLocal}
              onChange={(e) => setNewExpirationLocal(e.target.value)}
              disabled={isLoading || isPending}
              inputProps={{ "aria-label": "Vrijedi do" }}
              sx={{ maxWidth: 320 }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!effectiveLocal || isPending || isLoading}
            >
              Spremi
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
