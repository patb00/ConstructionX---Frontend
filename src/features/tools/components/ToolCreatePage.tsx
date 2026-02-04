import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ToolForm from "./ToolForm";
import { useAddTool } from "../hooks/useAddTool";

export default function ToolCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: addTool, isPending: creating } = useAddTool();

  const handleSubmit = async (values: any) => {
    await addTool(values);
    navigate("/app/tools");
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("tools.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/tools")}
          sx={{ color: "primary.main" }}
        >
          {t("tools.create.back")}
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
        <ToolForm onSubmit={handleSubmit} busy={creating} />
      </Paper>
    </Stack>
  );
}
