import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateRole } from "../hooks/useUpdateRole";
import { useRole } from "../hooks/useRole";
import RoleForm from "./RoleForm";
import { useTranslation } from "react-i18next";

export default function RoleEditPage() {
  const { t } = useTranslation();
  const { roleId } = useParams<{ roleId: string }>();
  if (!roleId) return <div>{t("roles.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();
  const { data: role, isLoading, error } = useRole(roleId);
  const { mutateAsync: updateRole, isPending } = useUpdateRole();

  const defaultValues = role && {
    name: role.name,
    description: role.description,
  };

  const handleSubmit = async (values: any) => {
    await updateRole({ id: roleId, ...values });
    navigate("/app/administration/roles");
  };

  if (error) return <div>{t("roles.edit.loadError")}</div>;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("roles.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/roles")}
          sx={{ color: "primary.main" }}
        >
          {t("roles.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, width: "100%" }}
      >
        <RoleForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={isLoading || isPending}
        />
      </Paper>
    </Stack>
  );
}
