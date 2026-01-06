import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MaterialForm from "./MaterialForm";
import { useAddMaterial } from "../hooks/useAddMaterial";

export default function MaterialCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: addMaterial, isPending: creating } = useAddMaterial();

  const handleSubmit = async (values: any) => {
    await addMaterial(values);
    navigate("/app/materials");
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("materials.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/materials")}
          sx={{ color: "primary.main" }}
        >
          {t("materials.create.back")}
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
        <MaterialForm onSubmit={handleSubmit} busy={creating} />
      </Paper>
    </Stack>
  );
}
