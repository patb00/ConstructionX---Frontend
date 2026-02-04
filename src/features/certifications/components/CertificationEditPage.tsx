import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useState } from "react";
import type { UpdateCertificationRequest } from "..";
import { useCertification } from "../hooks/useCertification";
import { useUpdateCertification } from "../hooks/useUpdateCertification";
import { useUploadCertificationCertificate } from "../hooks/useUploadCertificationCertificate";
import { useDownloadCertificationCertificate } from "../hooks/useDownloadCertificationCertificate";
import CertificationForm from "./CertificationForm";
import {
  certificationToDefaultValues,
  certificationToUpdatePayload,
} from "../utils/certificationForm";
import { downloadBlob } from "../../../utils/downloadBlob";

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

  const { mutateAsync: updateCertification, isPending: updating } =
    useUpdateCertification();
  const { mutateAsync: uploadCertificate, isPending: uploading } =
    useUploadCertificationCertificate();
  const { mutateAsync: downloadCertificate } =
    useDownloadCertificationCertificate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (error) return <div>{t("certifications.edit.loadError")}</div>;

  const handleSubmit = async (values: Omit<UpdateCertificationRequest, "id">) => {
    const payload = certificationToUpdatePayload(certificationId, values);

    await updateCertification(payload as any);

    if (selectedFile) {
      await uploadCertificate({
        certificationId,
        file: selectedFile,
      });
    }

    navigate("/app/certifications");
  };

  const handleDownload = async () => {
    const blob = await downloadCertificate(certificationId);
    if (blob) {
      const fileName = certification?.certificatePath?.split("/").pop() || "certificate.pdf";
      downloadBlob(blob, fileName);
    }
  };

  const busy = isLoading || updating || uploading;

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
          selectedFile={selectedFile}
          onFileChange={setSelectedFile}
          onDownload={handleDownload}
        />
      </Paper>
    </Stack>
  );
}
