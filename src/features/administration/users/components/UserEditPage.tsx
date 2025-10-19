import { useEffect, useState } from "react";
import { Paper, Stack, Typography, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "react-i18next";

export default function UserEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>{t("users.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(id);
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ id, firstName, lastName, phoneNumber });
    navigate("/app/administration/users");
  };

  if (error) return <div>{t("users.edit.loadError")}</div>;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("users.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/users")}
          sx={{ color: "primary.main" }}
        >
          {t("users.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          p: 2,
          width: "100%",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} maxWidth={480}>
            <Typography variant="subtitle1">
              {t("users.edit.userLabel")}: <strong>{email}</strong>
            </Typography>

            <TextField
              size="small"
              label={t("users.form.field.firstName")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading || isPending}
            />
            <TextField
              size="small"
              label={t("users.form.field.lastName")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading || isPending}
            />
            <TextField
              size="small"
              label={t("users.form.field.phoneNumber")}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading || isPending}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isPending || isLoading}
            >
              {t("users.form.submit")}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
