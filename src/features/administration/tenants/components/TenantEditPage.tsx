import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import TenantForm, { type TenantFormValues } from "./TenantForm";

import { useTenant } from "../hooks/useTenant";
import { useUpdateSubscription } from "../hooks/useUpdateSubscription";
import { useUpdateTenant } from "../hooks/useUpdateTenant";
import { useUploadTenantLogo } from "../hooks/useUploadTenantLogo";

import {
  type TenantSubscriptionFormValues,
  tenantToSubscriptionDefaults,
  tenantToEditDefaults,
  localInputToIso,
  buildUpdateTenantPayload,
} from "../utils/tenantForm";

export default function TenantEditPage() {
  const { t } = useTranslation();
  const { tenantId } = useParams<{ tenantId: string }>();
  if (!tenantId) return <div>{t("tenants.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();
  const { data: tenant, isLoading, error } = useTenant(tenantId);

  const { mutateAsync: updateSubscription, isPending: updatingSub } =
    useUpdateSubscription();
  const { mutateAsync: updateTenant, isPending: updatingTenant } =
    useUpdateTenant();
  const { mutateAsync: uploadLogo, isPending: uploadingLogo } =
    useUploadTenantLogo();

  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);

  if (error) return <div>{t("tenants.edit.loadError")}</div>;

  const fields: FieldConfig<TenantSubscriptionFormValues>[] = [
    {
      name: "validUpToDate",
      label: t("tenants.edit.validUntil"),
      type: "datetime-local",
      required: true,
    },
  ];

  const defaultValues = tenantToSubscriptionDefaults(tenant);
  const editDefaultValues = tenantToEditDefaults(tenant);

  const handleEditSubmit = async (values: TenantFormValues<"edit">) => {
    const { tenantId: id, payload } = buildUpdateTenantPayload(
      tenantId,
      values
    );

    await updateTenant({ tenantId: id, payload });

    if (selectedLogoFile) {
      await uploadLogo({ tenantId: id, file: selectedLogoFile });
      setSelectedLogoFile(null);
    }
  };

  const handleSubmit = async (values: TenantSubscriptionFormValues) => {
    if (!values.validUpToDate) return;

    await updateSubscription({
      tenantId,
      newExpirationDate: localInputToIso(values.validUpToDate),
    });
  };

  const busySub = isLoading || updatingSub;
  const busyEdit = isLoading || updatingTenant || uploadingLogo;

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
            busy={busySub}
            submitLabel={t("tenants.edit.save")}
            onSubmit={handleSubmit}
          />
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          p: 2,
          width: "100%",
        }}
      >
        <Stack spacing={2}>
          <TenantForm
            mode="edit"
            defaultValues={editDefaultValues}
            onSubmit={handleEditSubmit}
            busy={busyEdit}
            selectedLogoFile={selectedLogoFile}
            onLogoFileChange={setSelectedLogoFile}
            logoFileAccept="image/*"
            existingLogoFileName={tenant?.logoFileName ?? null}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}
