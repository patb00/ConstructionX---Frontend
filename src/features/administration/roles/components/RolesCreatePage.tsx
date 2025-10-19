import { Button, Paper, Stack, Typography } from "@mui/material";
import RoleForm from "./RoleForm";
import { useAddRole } from "../hooks/useAddRole";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function RoleCreatePage() {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useAddRole();
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("roles.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/roles")}
          sx={{ color: "primary.main" }}
        >
          {t("roles.create.back")}
        </Button>
      </Stack>
      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <RoleForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
