import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import UserForm from "./UserForm";
import { useRegisterUser } from "../hooks/useRegisterUser";
import { useUpdateRoles } from "../hooks/useUpdateRoles";

import type { RegisterUserRequest } from "..";
import { useRoleOptions } from "../../../constants/options/useRolesOptions";

export default function RegisterUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: registerUser, isPending } = useRegisterUser();
  const { mutateAsync: updateRoles, isPending: updatingRoles } =
    useUpdateRoles();

  const { roleOptions, rolesRows, isLoading: rolesLoading } = useRoleOptions();

  const handleSubmit = async (values: RegisterUserRequest) => {
    const res: any = await registerUser(values);
    const userId: string | undefined = res?.data;
    if (!userId) return;

    await updateRoles({
      userId,
      payload: {
        userRoles: (rolesRows ?? []).map((r: any) => ({
          roleId: r.id,
          name: r.name,
          description: r.description ?? null,
          isAssigned: r.id === values.roleId,
        })),
      },
    });

    navigate("/app/administration/users");
  };

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
        >
          {t("users.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <UserForm
          mode="create"
          roleOptions={roleOptions}
          busy={isPending || updatingRoles || rolesLoading}
          onSubmit={handleSubmit}
        />
      </Paper>
    </Stack>
  );
}
