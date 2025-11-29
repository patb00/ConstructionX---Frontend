import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTenant } from "../hooks/useTenant";
import { useUpdateSubscription } from "../hooks/useUpdateSubscription";
import { useTranslation } from "react-i18next";
import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";

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

type TenantSubscriptionFormValues = {
  validUpToDate: string;
};

export default function TenantEditPage() {
  const { t } = useTranslation();
  const { tenantId } = useParams<{ tenantId: string }>();
  if (!tenantId) return <div>{t("tenants.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();
  const { data: tenant, isLoading, error } = useTenant(tenantId);
  const { mutateAsync: updateSubscription, isPending } =
    useUpdateSubscription();

  if (error) return <div>{t("tenants.edit.loadError")}</div>;

  const fields: FieldConfig<TenantSubscriptionFormValues>[] = [
    {
      name: "validUpToDate",
      label: t("tenants.edit.validUntil"),
      type: "datetime-local",
      required: true,
    },
  ];

  const defaultValues: TenantSubscriptionFormValues | undefined = tenant && {
    validUpToDate: isoToLocalInput(tenant.validUpToDate ?? null),
  };

  const handleSubmit = async (values: TenantSubscriptionFormValues) => {
    if (!values.validUpToDate) return;

    await updateSubscription({
      tenantId,
      newExpirationDate: localInputToIso(values.validUpToDate),
    });
  };

  const busy = isLoading || isPending;

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
        <Stack spacing={2}>
          <Typography variant="subtitle1">
            {t("tenants.edit.tenantLabel")}: <strong>{tenant?.name}</strong> (
            {tenantId})
          </Typography>

          <SmartForm<TenantSubscriptionFormValues>
            fields={fields}
            rows={[["validUpToDate"]]}
            defaultValues={defaultValues}
            busy={busy}
            submitLabel={t("tenants.edit.save")}
            onSubmit={handleSubmit}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}
