import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAddExaminationType } from "../hooks/useAddExaminationType";
import ExaminationTypeForm from "./ExaminationTypeForm";

export default function ExaminationTypeCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useAddExaminationType();

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("examinationTypes.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/examinationTypes")}
          sx={{ color: "primary.main" }}
        >
          {t("examinationTypes.create.back")}
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
        <ExaminationTypeForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
