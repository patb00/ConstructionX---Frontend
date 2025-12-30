import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAddCondo } from "../hooks/useAddCondo";

import CondoForm from "./CondoForm";

export default function CondoCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync, isPending: creating } = useAddCondo();

  const busy = creating;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("condos.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/condos")}
          sx={{ color: "primary.main" }}
        >
          {t("condos.create.back")}
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
        <CondoForm onSubmit={mutateAsync} busy={busy} />
      </Paper>
    </Stack>
  );
}
