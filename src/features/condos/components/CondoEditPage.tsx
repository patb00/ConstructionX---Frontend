import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CondoForm from "./CondoForm";
import type { NewCondoRequest } from "..";
import { useUpdateCondo } from "../hooks/useUpdateCondo";
import { useCondo } from "../hooks/useCondo";
import { condoToDefaultValues } from "../utils/condoForm";

export default function CondoEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const condoId = Number(id);

  if (!Number.isFinite(condoId))
    return <div>{t("condos.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();

  const { data: condo, isLoading: condoLoading, error } = useCondo(condoId);
  const { mutate: updateCondo, isPending: updating } = useUpdateCondo();

  const defaultValues: Partial<NewCondoRequest> | undefined =
    condoToDefaultValues(condo);

  const handleSubmit = (values: NewCondoRequest) => {
    const idForUpdate =
      typeof (condo as any)?.id === "number" ? (condo as any).id : condoId;

    updateCondo({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/condos"),
    });
  };

  if (error) return <div>{t("condos.edit.loadError")}</div>;

  const busy = condoLoading || updating;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("condos.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/condos")}
          sx={{ color: "primary.main" }}
        >
          {t("condos.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <CondoForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
        />
      </Paper>
    </Stack>
  );
}
