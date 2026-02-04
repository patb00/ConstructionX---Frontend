import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { NewToolRepairRequest } from "..";
import { useToolRepair } from "../hooks/useToolRepair";
import { useUpdateToolRepair } from "../hooks/useUpdateToolRepair";
import { toolRepairToDefaultValues } from "../utils/toolRepairForm";
import ToolRepairForm from "../components/ToolRepairForm";

export default function ToolRepairEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const repairId = Number(id);

  if (!Number.isFinite(repairId)) {
    return <div>{t("toolRepairs.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: repair,
    isLoading: loadingRepair,
    error,
  } = useToolRepair(repairId);

  const { mutate: updateRepair, isPending: updating } = useUpdateToolRepair();

  if (error) return <div>{t("toolRepairs.edit.loadError")}</div>;

  const defaultValues: NewToolRepairRequest | undefined =
    toolRepairToDefaultValues(repair);

  const handleSubmit = (values: NewToolRepairRequest) => {
    const idForUpdate =
      typeof (repair as any)?.id === "number" ? (repair as any).id : repairId;

    updateRepair({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/tool-repairs"),
    });
  };

  const busy = loadingRepair || updating;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("toolRepairs.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/tool-repairs")}
          sx={{ color: "primary.main" }}
        >
          {t("toolRepairs.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <ToolRepairForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
        />
      </Paper>
    </Stack>
  );
}
