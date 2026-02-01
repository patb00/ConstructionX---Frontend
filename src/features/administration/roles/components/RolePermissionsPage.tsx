import { useNavigate, useParams } from "react-router-dom";
import { useRolesFull } from "../hooks/useRolesFull";
import {
  Box,
  Checkbox,
  Typography,
  Stack,
  Button,
  Card,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useUpdateRolePermissions } from "../hooks/useUpdateRolePermission";
import { usePermissions } from "../hooks/usePermissions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import { groupPermissions } from "../utils/permissions";
import { LineTabs } from "../../../../components/ui/tabs/LineTabs";

export default function RolePermissionsPage() {
  const { t } = useTranslation();
  const { roleId } = useParams<{ roleId: string }>();
  const { data: role, isLoading: roleLoading } = useRolesFull(roleId!);
  const { data: permissionsData, isLoading: permsLoading } = usePermissions();
  const updatePermissions = useUpdateRolePermissions();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const allPermissions: string[] = useMemo(() => {
    if (!permissionsData) return [];
    if (Array.isArray(permissionsData)) return permissionsData;
    return permissionsData.permissions ?? [];
  }, [permissionsData]);

  useEffect(() => {
    if (role?.permissions) setSelected(role.permissions);
  }, [role]);

  const groups = useMemo(
    () => groupPermissions(allPermissions),
    [allPermissions],
  );
  const categories = useMemo(() => Object.keys(groups).sort(), [groups]);

  const activeCategory = categories[tab] ?? categories[0];
  const activePermissions = activeCategory ? groups[activeCategory] : [];

  const togglePermission = (perm: string) => {
    setSelected((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const handleUpdate = () => {
    if (!role) return;
    updatePermissions.mutate({
      roleId: role.id,
      newPermissions: selected,
    });
  };

  if (roleLoading || permsLoading)
    return <Typography>{t("common.loading")}</Typography>;
  if (!role) return <Typography>{t("roles.permissions.notFound")}</Typography>;
  if (allPermissions.length === 0)
    return <Typography>{t("roles.permissions.noneAvailable")}</Typography>;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("roles.permissions.title", { name: role.name })}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/roles")}
          sx={{ color: "primary.main" }}
        >
          {t("roles.permissions.back")}
        </Button>
      </Stack>

      <LineTabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        items={categories.map((cat, index) => ({
          value: index,
          label: t("roles.permissions.tabLabel", {
            category: cat,
            count: groups[cat].length,
          }),
        }))}
      />

      <Card sx={{ p: 2 }}>
        {activePermissions.map((perm) => (
          <Stack
            key={perm}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: 1 }}
          >
            <Typography sx={{ flex: 1 }}>{perm}</Typography>
            <Checkbox
              checked={selected.includes(perm)}
              onChange={() => togglePermission(perm)}
            />
          </Stack>
        ))}
      </Card>

      <Box>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={updatePermissions.isPending}
        >
          {updatePermissions.isPending
            ? t("roles.permissions.saving")
            : t("roles.permissions.update")}
        </Button>
      </Box>
    </Stack>
  );
}
