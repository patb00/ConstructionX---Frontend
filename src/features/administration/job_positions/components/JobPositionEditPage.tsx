import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useJobPosition } from "../hooks/useJobPosition";
import { useUpdateJobPosition } from "../hooks/useUpdateJobPosition";
import JobPositionForm from "./JobPositionForm";
import type { NewJobPositionRequest } from "..";
import { useTranslation } from "react-i18next";

export default function JobPositionEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const jobId = Number(id);
  if (!Number.isFinite(jobId))
    return <div>{t("jobPositions.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();
  const { data: job, isLoading, error } = useJobPosition(jobId);
  const { mutate: updateJob, isPending } = useUpdateJobPosition();

  const defaultValues: NewJobPositionRequest | undefined = job && {
    name: job.name ?? "",
    description: job.description ?? null,
  };

  const handleSubmit = (values: NewJobPositionRequest) => {
    const idForUpdate = typeof job?.id === "number" ? job.id : jobId;
    updateJob({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/administration/jobPositions"),
    });
  };

  if (error) return <div>{t("jobPositions.edit.loadError")}</div>;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("jobPositions.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/jobPositions")}
          sx={{ color: "primary.main" }}
        >
          {t("jobPositions.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <JobPositionForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={isLoading || isPending}
        />
      </Paper>
    </Stack>
  );
}
