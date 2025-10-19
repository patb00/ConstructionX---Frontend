import { Button, Paper, Stack, Typography } from "@mui/material";
import { useAddJobPosition } from "../hooks/useAddJobPosition";
import JobPositionForm from "./JobPositionForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function JobPositionCreatePage() {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useAddJobPosition();
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("jobPositions.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/jobPositions")}
          sx={{ color: "primary.main" }}
        >
          {t("jobPositions.create.back")}
        </Button>
      </Stack>
      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <JobPositionForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
