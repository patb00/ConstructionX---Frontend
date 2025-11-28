import * as React from "react";
import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAddTenant } from "../hooks/useAddTenant";
import TenantForm from "./TenantForm";
import { useTranslation } from "react-i18next";
import { useUploadTenantLogo } from "../hooks/useUploadTenantLogo";
import type { NewTenantRequest } from "..";

export default function TenantCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: addTenant, isPending: creating } = useAddTenant();
  const { mutateAsync: uploadLogo, isPending: uploading } =
    useUploadTenantLogo();

  const [selectedLogoFile, setSelectedLogoFile] = React.useState<File | null>(
    null
  );

  const handleSubmit = async (values: NewTenantRequest) => {
    const result = await addTenant(values);

    const tenant = (result as any)?.data;
    const tenantId: string | undefined =
      tenant?.id ?? tenant?.identifier ?? tenant?.tenantId;

    if (!tenantId) {
      navigate("/app/administration/tenants");
      return;
    }

    if (selectedLogoFile) {
      await uploadLogo({ tenantId, file: selectedLogoFile });
    }

    navigate("/app/administration/tenants");
  };

  const busy = creating || uploading;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("tenants.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/tenants")}
          sx={{ color: "primary.main" }}
        >
          {t("tenants.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <TenantForm
          onSubmit={handleSubmit}
          busy={busy}
          selectedLogoFile={selectedLogoFile}
          onLogoFileChange={setSelectedLogoFile}
          logoFileAccept="image/*"
        />
      </Paper>
    </Stack>
  );
}
