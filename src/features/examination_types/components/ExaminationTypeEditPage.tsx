import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { NewExaminationTypeRequest } from "..";
import { useExaminationType } from "../hooks/useExaminationType";
import { useUpdateExaminationType } from "../hooks/useUpdateExaminationType";
import ExaminationTypeForm from "./ExaminationTypeForm";

export default function ExaminationTypeEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const examinationTypeId = Number(id);

  if (!Number.isFinite(examinationTypeId)) {
    return <div>{t("examinationTypes.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: examinationType,
    isLoading,
    error,
  } = useExaminationType(examinationTypeId);

  const { mutate: updateExaminationType, isPending } =
    useUpdateExaminationType();

  const defaultValues: NewExaminationTypeRequest | undefined =
    examinationType && {
      examinationTypeName: examinationType.examinationTypeName ?? "",
      monthsToNextExamination: examinationType.monthsToNextExamination ?? 0,
    };

  const handleSubmit = (values: NewExaminationTypeRequest) => {
    const idForUpdate =
      typeof examinationType?.id === "number"
        ? examinationType.id
        : examinationTypeId;

    updateExaminationType({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/examinationTypes"),
    });
  };

  if (error) {
    return <div>{t("examinationTypes.edit.loadError")}</div>;
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
          {t("examinationTypes.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/examinationTypes")}
          sx={{ color: "primary.main" }}
        >
          {t("examinationTypes.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <ExaminationTypeForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={isLoading || isPending}
        />
      </Paper>
    </Stack>
  );
}
