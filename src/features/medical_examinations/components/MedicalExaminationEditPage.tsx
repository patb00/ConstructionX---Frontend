import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import type { NewMedicalExaminationRequest } from "..";
import { useMedicalExamination } from "../hooks/useMedicalExamination";
import { useUpdateMedicalExamination } from "../hooks/useUpdateMedicalExamination";
import { useUploadMedicalExaminationCertificate } from "../hooks/useUploadMedicalExaminationCertificate";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useExaminationTypes } from "../../examination_types/hooks/useExaminationTypes";

import MedicalExaminationForm from "./MedicalExaminationForm";
import { toEmployeeOptions, toExaminationTypeOptions } from "../utils/options";
import {
  medicalExaminationToDefaultValues,
  medicalExaminationToUpdatePayload,
} from "../utils/medicalExaminationForm";

export default function MedicalExaminationEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const medicalExaminationId = Number(id);

  const navigate = useNavigate();

  if (!Number.isFinite(medicalExaminationId)) {
    return <div>{t("medicalExaminations.edit.invalidUrlId")}</div>;
  }

  const {
    data: examination,
    isLoading: examinationLoading,
    error,
  } = useMedicalExamination(medicalExaminationId);

  const { mutate: updateExamination, isPending: updating } =
    useUpdateMedicalExamination();

  const { mutateAsync: uploadCertificate, isPending: uploading } =
    useUploadMedicalExaminationCertificate();

  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();
  const { examinationTypesRows = [], isLoading: examinationTypesLoading } =
    useExaminationTypes();

  const employeeOptions = toEmployeeOptions(employeeRows);
  const examinationTypeOptions = toExaminationTypeOptions(examinationTypesRows);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const defaultValues = medicalExaminationToDefaultValues(examination);

  const handleSubmit = (values: NewMedicalExaminationRequest) => {
    const idForUpdate =
      typeof (examination as any)?.id === "number"
        ? (examination as any).id
        : medicalExaminationId;

    const payload = medicalExaminationToUpdatePayload(idForUpdate, values);

    updateExamination(payload as any, {
      onSuccess: async () => {
        if (selectedFile) {
          await uploadCertificate({
            medicalExaminationId: idForUpdate,
            file: selectedFile,
          });
        }

        navigate("/app/medicalExaminations");
      },
    });
  };

  if (error) {
    return <div>{t("medicalExaminations.edit.loadError")}</div>;
  }

  const busy =
    examinationLoading ||
    updating ||
    uploading ||
    employeesLoading ||
    examinationTypesLoading;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("medicalExaminations.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/medicalExaminations")}
          sx={{ color: "primary.main" }}
        >
          {t("medicalExaminations.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <MedicalExaminationForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
          employeeOptions={employeeOptions}
          examinationTypeOptions={examinationTypeOptions}
          showEmployeeField={false}
          selectedFile={selectedFile}
          onFileChange={setSelectedFile}
          existingCertificatePath={examination?.certificatePath ?? null}
        />
      </Paper>
    </Stack>
  );
}
