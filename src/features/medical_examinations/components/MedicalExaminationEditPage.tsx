import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import type { UpdateMedicalExaminationRequest } from "..";
import { useMedicalExamination } from "../hooks/useMedicalExamination";
import { useUpdateMedicalExamination } from "../hooks/useUpdateMedicalExamination";
import { useUploadMedicalExaminationCertificate } from "../hooks/useUploadMedicalExaminationCertificate";
import { useDownloadMedicalExaminationCertificate } from "../hooks/useDownloadMedicalExaminationCertificate";
import MedicalExaminationForm from "./MedicalExaminationForm";
import {
  medicalExaminationToDefaultValues,
  medicalExaminationToUpdatePayload,
} from "../utils/medicalExaminationForm";
import { downloadBlob } from "../../../utils/downloadBlob";

export default function MedicalExaminationEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const medicalExaminationId = Number(id);
  const navigate = useNavigate();

  const {
    data: examination,
    isLoading,
    error,
  } = useMedicalExamination(medicalExaminationId);

  const { mutate: updateExam, isPending: updating } =
    useUpdateMedicalExamination();
  const { mutateAsync: uploadCertificate, isPending: uploading } =
    useUploadMedicalExaminationCertificate();
  const { mutateAsync: downloadCertificate } =
    useDownloadMedicalExaminationCertificate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (error) return <div>{t("medicalExaminations.edit.loadError")}</div>;

  const handleSubmit = (
    values: Omit<UpdateMedicalExaminationRequest, "id">
  ) => {
    const payload = medicalExaminationToUpdatePayload(
      medicalExaminationId,
      values
    );

    updateExam(payload as any, {
      onSuccess: async () => {
        if (selectedFile) {
          await uploadCertificate({
            medicalExaminationId,
            file: selectedFile,
          });
        }
      },
    });
  };

  const handleDownload = async () => {
    const blob = await downloadCertificate(medicalExaminationId);
    if (blob) {
      const fileName = examination?.certificatePath?.split("/").pop() || "certificate.pdf";
      downloadBlob(blob, fileName);
    }
  };

  const busy = isLoading || updating || uploading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("medicalExaminations.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/medicalExaminations")}
        >
          {t("medicalExaminations.edit.back")}
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 2 }}>
        <MedicalExaminationForm
          mode="edit"
          defaultValues={medicalExaminationToDefaultValues(examination)}
          onSubmit={handleSubmit}
          busy={busy}
          showEmployeeField={false}
          selectedFile={selectedFile}
          onFileChange={setSelectedFile}
          existingCertificatePath={examination?.certificatePath ?? null}
          onDownload={handleDownload}
        />
      </Paper>
    </Stack>
  );
}
