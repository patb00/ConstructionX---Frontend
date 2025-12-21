import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAddMedicalExamination } from "../hooks/useAddMedicalExamination";
import { useUploadMedicalExaminationCertificate } from "../hooks/useUploadMedicalExaminationCertificate";
import MedicalExaminationForm from "./MedicalExaminationForm";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useExaminationTypes } from "../../examination_types/hooks/useExaminationTypes";
import type { NewMedicalExaminationRequest } from "..";
import { useState } from "react";
import { toEmployeeOptions, toExaminationTypeOptions } from "../utils/options";

export default function MedicalExaminationCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: createExam, isPending: creating } =
    useAddMedicalExamination();

  const { mutateAsync: uploadCertificate, isPending: uploading } =
    useUploadMedicalExaminationCertificate();

  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();
  const { examinationTypesRows = [], isLoading: examinationTypesLoading } =
    useExaminationTypes();

  const employeeOptions = toEmployeeOptions(employeeRows);
  const examinationTypeOptions = toExaminationTypeOptions(examinationTypesRows);

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

  const busy =
    creating || uploading || employeesLoading || examinationTypesLoading;

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
          sx={{ color: "primary.main" }}
        >
          {t("medicalExaminations.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
          p: 2,
        }}
      >
        <MedicalExaminationForm
          onSubmit={handleSubmit}
          busy={busy}
          employeeOptions={employeeOptions}
          examinationTypeOptions={examinationTypeOptions}
          showEmployeeField={true}
          selectedFile={selectedFile}
          onFileChange={setSelectedFile}
        />
      </Paper>
    </Stack>
  );
}
