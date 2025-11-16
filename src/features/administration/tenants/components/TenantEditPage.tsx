import { Paper, Stack, Typography, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTenant } from "../hooks/useTenant";
import { useUpdateSubscription } from "../hooks/useUpdateSubscription";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { tenantId } = useParams<{ tenantId: string }>();
  if (!tenantId) return <div>{t("tenants.edit.invalidUrlId")}</div>;

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

  if (error) return <div>{t("tenants.edit.loadError")}</div>;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("tenants.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/tenants")}
          sx={{ color: "primary.main" }}
        >
          {t("tenants.edit.back")}
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
              {t("tenants.edit.tenantLabel")}: <strong>{tenant?.name}</strong> (
              {tenantId})
            </Typography>

            <TextField
              label={t("tenants.edit.validUntil")}
              type="datetime-local"
              value={effectiveLocal}
              onChange={(e) => setNewExpirationLocal(e.target.value)}
              disabled={isLoading || isPending}
              inputProps={{ "aria-label": t("tenants.edit.validUntil") }}
              sx={{ maxWidth: 320 }}
            />

            <Button
              size="small"
              type="submit"
              variant="contained"
              disabled={!effectiveLocal || isPending || isLoading}
            >
              {t("tenants.edit.save")}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
