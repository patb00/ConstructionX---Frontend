import { useParams } from "react-router-dom";
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
import { useState, useEffect } from "react";
import { useUpdateRolePermissions } from "../hooks/useUpdateRolePermission";

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
  const { data, isLoading } = useRolesFull(roleId!);
  const updatePermissions = useUpdateRolePermissions();

  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (data?.permissions) {
      setSelected(data.permissions);
    }
  }, [data]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!data) return <Typography>No role found.</Typography>;

  const groups = groupPermissions([...data.permissions]);
  const categories = Object.keys(groups);

  const activeCategory = categories[tab] ?? categories[0];
  const activePermissions = activeCategory ? groups[activeCategory] : [];

  const togglePermission = (perm: string) => {
    setSelected((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleUpdate = () => {
    updatePermissions.mutate({
      roleId: data.id,
      newPermissions: selected,
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{data.name} – Permissions</Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
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
          {updatePermissions.isPending ? "Saving..." : "Update Permissions"}
        </Button>
      </Box>
    </Stack>
  );
}
