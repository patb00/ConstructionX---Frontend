import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { NewCertificationTypeRequest } from "..";
import { useCertificationType } from "../hooks/useCertificationType";
import { useUpdateCertificationType } from "../hooks/useUpdateCertificationType";
import CertificationTypeForm from "./CertificationTypeForm";

export default function CertificationTypeEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const certificationTypeId = Number(id);

  if (!Number.isFinite(certificationTypeId)) {
    return <div>{t("certificationTypes.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: certificationType,
    isLoading,
    error,
  } = useCertificationType(certificationTypeId);

  const { mutate: updateCertificationType, isPending } =
    useUpdateCertificationType();

  const defaultValues: NewCertificationTypeRequest | undefined =
    certificationType && {
      certificationTypeName: certificationType.certificationTypeName ?? "",
      requiresRenewal: certificationType.requiresRenewal ?? false,
      monthsToRenewal: certificationType.monthsToRenewal ?? 0,
    };

  const handleSubmit = (values: NewCertificationTypeRequest) => {
    const idForUpdate =
      typeof certificationType?.id === "number"
        ? certificationType.id
        : certificationTypeId;

    updateCertificationType({ id: idForUpdate, ...values } as any);
  };

  if (error) {
    return <div>{t("certificationTypes.edit.loadError")}</div>;
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("certificationTypes.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/certificationTypes")}
          sx={{ color: "primary.main" }}
        >
          {t("certificationTypes.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <CertificationTypeForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={isLoading || isPending}
        />
      </Paper>
    </Stack>
  );
}
