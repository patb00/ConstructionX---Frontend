import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useState } from "react";
import { useAddCertification } from "../hooks/useAddCertification";
import { useUploadCertificationCertificate } from "../hooks/useUploadCertificationCertificate";
import CertificationForm from "./CertificationForm";
import type { NewCertificationRequest } from "..";

export default function CertificationCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: createCertification, isPending: creating } =
    useAddCertification();
  const { mutateAsync: uploadCertificate, isPending: uploading } =
    useUploadCertificationCertificate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (values: NewCertificationRequest) => {
    const result = await createCertification(values);
    const newId = (result as any)?.data?.id || (result as any)?.data;

    if (newId && selectedFile) {
      await uploadCertificate({
        certificationId: Number(newId),
        file: selectedFile,
      });
    }

    navigate("/app/certifications");
  };

  const busy = creating || uploading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("certifications.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/certifications")}
        >
          {t("certifications.create.back")}
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 2 }}>
        <CertificationForm
          mode="create"
          onSubmit={handleSubmit}
          busy={busy}
          showEmployeeField
          selectedFile={selectedFile}
          onFileChange={setSelectedFile}
        />
      </Paper>
    </Stack>
  );
}
