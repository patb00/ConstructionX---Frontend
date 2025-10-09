import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useJobPosition } from "../hooks/useJobPosition";
import { useUpdateJobPosition } from "../hooks/useUpdateJobPosition";
import JobPositionForm from "./JobPositionForm";
import type { NewJobPositionRequest } from "..";

export default function JobPositionEditPage() {
  const { id } = useParams<{ id: string }>();

  const jobId = Number(id);
  if (!Number.isFinite(jobId)) return <div>Neispravan URL (id)</div>;

  const navigate = useNavigate();
  const { data: job, isLoading, error } = useJobPosition(jobId);
  const { mutate: updateJob, isPending } = useUpdateJobPosition();

  const defaultValues: NewJobPositionRequest | undefined = job && {
    name: job.name ?? "",
    description: job.description ?? null,
  };

  const handleSubmit = (values: NewJobPositionRequest) => {
    const idForUpdate = typeof job?.id === "number" ? job.id : jobId; // ensure number
    updateJob({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/administration/jobPositions"),
    });
  };

  if (error) return <div>Neuspjelo učitavanje radnog mjesta.</div>;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          Uredi radno mjesto
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/jobPositions")}
          sx={{
            color: "primary.main",
          }}
        >
          Natrag
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <JobPositionForm
          key={String(job?.id ?? jobId)}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={isLoading || isPending}
        />
      </Paper>
    </Stack>
  );
}
