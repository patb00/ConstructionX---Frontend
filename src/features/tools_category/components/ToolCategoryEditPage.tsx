import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import ToolCategoryForm from "./ToolCategoryForm";

import { useTranslation } from "react-i18next";
import { useUpdateToolCategory } from "../hooks/useUpdateToolCategory";
import type { NewToolCategoryRequest } from "..";
import { useToolCategory } from "../hooks/useToolCategory";

export default function ToolCategoryEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  if (!Number.isFinite(categoryId))
    return <div>{t("toolCategories.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();
  const {
    data: category,
    isLoading: catLoading,
    error,
  } = useToolCategory(categoryId);
  const { mutate: updateCategory, isPending } = useUpdateToolCategory();

  const defaultValues: NewToolCategoryRequest | undefined = category && {
    name: category.name ?? "",
    description: category.description ?? null,
  };

  const handleSubmit = (values: NewToolCategoryRequest) => {
    const idForUpdate =
      typeof category?.id === "number" ? category.id : categoryId;
    updateCategory({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/tool-categories"),
    });
  };

  if (error) return <div>{t("toolCategories.edit.loadError")}</div>;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("toolCategories.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/tool-categories")}
          sx={{ color: "primary.main" }}
        >
          {t("toolCategories.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <ToolCategoryForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={catLoading || isPending}
        />
      </Paper>
    </Stack>
  );
}
