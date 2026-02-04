import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { useAddMedicalExamination } from "../hooks/useAddMedicalExamination";
import { useUploadMedicalExaminationCertificate } from "../hooks/useUploadMedicalExaminationCertificate";
import MedicalExaminationForm from "./MedicalExaminationForm";
import type { NewMedicalExaminationRequest } from "..";

export default function MedicalExaminationCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: createExam, isPending: creating } =
    useAddMedicalExamination();
  const { mutateAsync: uploadCertificate, isPending: uploading } =
    useUploadMedicalExaminationCertificate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (values: NewMedicalExaminationRequest) => {
    const result = await createExam(values);
    const newId = (result as any)?.data as number | undefined;

    if (!newId) {
      navigate("/app/medicalExaminations");
      return;
    }

    if (selectedFile) {
      await uploadCertificate({
        medicalExaminationId: newId,
        file: selectedFile,
      });
    }

    navigate("/app/medicalExaminations");
  };

  const busy = creating || uploading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("medicalExaminations.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/medicalExaminations")}
        >
          {t("medicalExaminations.create.back")}
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 2 }}>
        <MedicalExaminationForm
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
