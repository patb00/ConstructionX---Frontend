import { Button, Paper, Stack, Typography } from "@mui/material";
import UserForm from "./UserForm";
import { useRegisterUser } from "../hooks/useRegisterUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function RegisterUserPage() {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useRegisterUser();
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("users.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/users")}
          sx={{ color: "primary.main" }}
        >
          {t("users.create.back")}
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
        <UserForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
