import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { UpdateCertificationRequest } from "..";
import { useCertification } from "../hooks/useCertification";
import { useUpdateCertification } from "../hooks/useUpdateCertification";
import CertificationForm from "./CertificationForm";
import {
  certificationToDefaultValues,
  certificationToUpdatePayload,
} from "../utils/certificationForm";

export default function CertificationEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const certificationId = Number(id);
  const navigate = useNavigate();

  const {
    data: certification,
    isLoading,
    error,
  } = useCertification(certificationId);

  const { mutate: updateCertification, isPending: updating } =
    useUpdateCertification();

  if (error) return <div>{t("certifications.edit.loadError")}</div>;

  const handleSubmit = (values: Omit<UpdateCertificationRequest, "id">) => {
    const payload = certificationToUpdatePayload(certificationId, values);

    updateCertification(payload as any, {
      onSuccess: () => {
        navigate("/app/certifications");
      },
    });
  };

  const busy = isLoading || updating;

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("certifications.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/certifications")}
        >
          {t("certifications.edit.back")}
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 2 }}>
        <CertificationForm
          mode="edit"
          defaultValues={certificationToDefaultValues(certification)}
          onSubmit={handleSubmit}
          busy={busy}
          showEmployeeField
        />
      </Paper>
    </Stack>
  );
}
