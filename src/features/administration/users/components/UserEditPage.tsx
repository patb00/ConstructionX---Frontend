import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import UserForm from "./UserForm";
import { useUser } from "../hooks/useUser";
import { useUpdateUser } from "../hooks/useUpdateUser";

import type { RegisterUserRequest, UpdateUserRequest } from "..";

export default function UserEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return <div>{t("users.edit.invalidUrlId")}</div>;

  const { data: user, isLoading, error } = useUser(id);
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  if (error) return <div>{t("users.edit.loadError")}</div>;

  const handleSubmit = async (values: RegisterUserRequest) => {
    const payload: UpdateUserRequest = {
      id,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
    };

    await updateUser(payload);
    navigate("/app/administration/users");
  };

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
        >
          {t("users.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <UserForm
          key={user?.id ?? "loading"}
          mode="edit"
          busy={isLoading || isPending}
          defaultValues={{
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            phoneNumber: user?.phoneNumber ?? "",
          }}
          onSubmit={handleSubmit}
        />
      </Paper>
    </Stack>
  );
}
