import { Paper, Stack, Typography } from "@mui/material";
import RoleForm from "./RoleForm";
import { useAddRole } from "../hooks/useAddRole";

export default function RoleCreatePage() {
  const { mutateAsync, isPending } = useAddRole();
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Kreiraj ulogu
      </Typography>
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
