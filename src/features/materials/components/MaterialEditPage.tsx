import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MaterialForm from "./MaterialForm";
import type { NewMaterialRequest } from "..";
import { useUpdateMaterial } from "../hooks/useUpdateMaterial";
import { useMaterial } from "../hooks/useMaterial";
import { materialToDefaultValues } from "../utils/materialForm";

export default function MaterialEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const materialId = Number(id);

  if (!Number.isFinite(materialId)) {
    return <div>{t("materials.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const { data: material, isLoading, error } = useMaterial(materialId);
  const { mutate: updateMaterial, isPending: updating } = useUpdateMaterial();

  if (error) {
    return <div>{t("materials.edit.loadError")}</div>;
  }

  const defaultValues = materialToDefaultValues(material) as
    | NewMaterialRequest
    | undefined;

  const handleSubmit = (values: NewMaterialRequest) => {
    updateMaterial({ id: materialId, ...values } as any, {
      onSuccess: () => navigate("/app/materials"),
    });
  };

  const busy = isLoading || updating;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("materials.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/materials")}
          sx={{ color: "primary.main" }}
        >
          {t("materials.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <MaterialForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
        />
      </Paper>
    </Stack>
  );
}
