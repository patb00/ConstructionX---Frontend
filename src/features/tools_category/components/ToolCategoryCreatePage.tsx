import { Button, Paper, Stack, Typography } from "@mui/material";
import ToolCategoryForm from "./ToolCategoryForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useAddToolCategory } from "../hooks/useAddToolCategory";

export default function ToolCategoryCreatePage() {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useAddToolCategory();
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("toolCategories.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/tool-categories")}
          sx={{ color: "primary.main" }}
        >
          {t("toolCategories.create.back")}
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
        <ToolCategoryForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
