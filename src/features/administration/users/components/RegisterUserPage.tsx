import { Button, Paper, Stack, Typography } from "@mui/material";
import UserForm from "./UserForm";
import { useRegisterUser } from "../hooks/useRegisterUser";
import { useUpdateRoles } from "../hooks/useUpdateRoles";
import { useRoles } from "../../roles/hooks/useRoles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { RegisterUserRequest } from "..";

export default function RegisterUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: registerUser, isPending } = useRegisterUser();
  const { mutateAsync: updateRoles, isPending: updatingRoles } =
    useUpdateRoles();

  const { rolesRows } = useRoles();

  const roleOptions = rolesRows.map((r) => ({
    label: r.name,
    value: r.id,
  }));

  const handleSubmit = async (values: RegisterUserRequest) => {
    const res: any = await registerUser(values);
    const userId: string | undefined = res?.data;
    if (!userId) return;

    await updateRoles({
      userId,
      payload: {
        userRoles: rolesRows.map((r) => ({
          roleId: r.id,
          name: r.name,
          description: (r as any).description ?? null,
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
        <UserForm
          onSubmit={handleSubmit}
          busy={isPending || updatingRoles}
          roleOptions={roleOptions}
        />
      </Paper>
    </Stack>
  );
}
