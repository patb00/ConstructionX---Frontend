import { useNavigate, useParams } from "react-router-dom";
import { useRolesFull } from "../hooks/useRolesFull";
import {
  Tabs,
  Tab,
  Box,
  Checkbox,
  Typography,
  Stack,
  Button,
  Paper,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useUpdateRolePermissions } from "../hooks/useUpdateRolePermission";
import { usePermissions } from "../hooks/usePermissions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function groupPermissions(perms: string[] = []) {
  const groups: Record<string, string[]> = {};
  perms.forEach((p) => {
    const [, group] = p.split(".");
    if (!groups[group]) groups[group] = [];
    groups[group].push(p);
  });
  return groups;
}

export default function RolePermissionsPage() {
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
    [allPermissions]
  );
  const categories = useMemo(() => Object.keys(groups).sort(), [groups]);

  const activeCategory = categories[tab] ?? categories[0];
  const activePermissions = activeCategory ? groups[activeCategory] : [];

  const togglePermission = (perm: string) => {
    setSelected((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
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
    return <Typography>Učitavanje...</Typography>;
  if (!role) return <Typography>Uloga nije pronađena.</Typography>;
  if (allPermissions.length === 0)
    return <Typography>Nema dostupnih dozvola.</Typography>;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">{role.name} – Dozvole</Typography>{" "}
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/roles")}
          sx={{
            color: "primary.main",
          }}
        >
          Natrag
        </Button>
      </Stack>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {categories.map((cat) => (
          <Tab key={cat} label={`${cat} (${groups[cat].length})`} />
        ))}
      </Tabs>

      <Paper sx={{ p: 2 }}>
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
      </Paper>

      <Box>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={updatePermissions.isPending}
        >
          {updatePermissions.isPending ? "Spremanje..." : "Ažuriraj dozvole"}
        </Button>
      </Box>
    </Stack>
  );
}
