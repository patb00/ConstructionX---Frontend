import * as React from "react";
import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { NewMedicalExaminationRequest } from "..";
import { useMedicalExamination } from "../hooks/useMedicalExamination";
import { useUpdateMedicalExamination } from "../hooks/useUpdateMedicalExamination";
import { useUploadMedicalExaminationCertificate } from "../hooks/useUploadMedicalExaminationCertificate";
import MedicalExaminationForm from "./MedicalExaminationForm";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useExaminationTypes } from "../../examination_types/hooks/useExaminationTypes";
import { toEmployeeOptions } from "../../../lib/options/employees";
import { toExaminationTypeOptions } from "../../../lib/options/examinationTypes";

export default function MedicalExaminationEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const medicalExaminationId = Number(id);

  if (!Number.isFinite(medicalExaminationId)) {
    return <div>{t("medicalExaminations.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: examination,
    isLoading: examinationLoading,
    error,
  } = useMedicalExamination(medicalExaminationId);

  const { mutate: updateExamination, isPending } =
    useUpdateMedicalExamination();

  const { mutateAsync: uploadCertificate, isPending: uploading } =
    useUploadMedicalExaminationCertificate();

  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();
  const { examinationTypesRows = [], isLoading: examinationTypesLoading } =
    useExaminationTypes();

  const employeeOptions = toEmployeeOptions(employeeRows);
  const examinationTypeOptions = toExaminationTypeOptions(examinationTypesRows);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const defaultValues: Partial<NewMedicalExaminationRequest> | undefined =
    examination && {
      examinationTypeId: examination.examinationTypeId,
      examinationDate: examination.examinationDate ?? "",
      nextExaminationDate: examination.nextExaminationDate ?? "",
      result: examination.result ?? "",
      note: examination.note ?? "",
    };

  console.log("[EditPage] Computed defaultValues (EDIT):", defaultValues);

  const handleSubmit = (values: NewMedicalExaminationRequest) => {
    const idForUpdate =
      typeof examination?.id === "number"
        ? examination.id
        : medicalExaminationId;

    console.log(
      "%c[EditPage] Submitted values (with employeeId in form-type):",
      "color: green; font-weight: bold;",
      values
    );

    const { employeeId: _ignored, ...rest } = values;

    const payload = {
      id: idForUpdate,
      ...rest,
    };

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

  console.log("examination", examination);

  const busy =
    examinationLoading ||
    isPending ||
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
