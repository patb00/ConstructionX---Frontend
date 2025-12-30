import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ToolForm from "./ToolForm";
import type { NewToolRequest } from "..";
import { useUpdateTool } from "../hooks/useUpdateTool";
import { useTool } from "../hooks/useTool";
import { toolToDefaultValues } from "../utils/toolForm";

export default function ToolEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const toolId = Number(id);

  if (!Number.isFinite(toolId)) {
    return <div>{t("tools.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const { data: tool, isLoading, error } = useTool(toolId);
  const { mutate: updateTool, isPending: updating } = useUpdateTool();

  if (error) {
    return <div>{t("tools.edit.loadError")}</div>;
  }

  const defaultValues = toolToDefaultValues(tool) as NewToolRequest | undefined;

  const handleSubmit = (values: NewToolRequest) => {
    updateTool({ id: toolId, ...values } as any, {
      onSuccess: () => navigate("/app/tools"),
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
          {t("tools.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/tools")}
          sx={{ color: "primary.main" }}
        >
          {t("tools.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <ToolForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
        />
      </Paper>
    </Stack>
  );
}
