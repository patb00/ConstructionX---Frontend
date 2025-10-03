import { Paper, Stack, Typography } from "@mui/material";
import UserForm from "./UserForm";
import { useRegisterUser } from "../hooks/useRegisterUser";

export default function RegiserUserPage() {
  const { mutateAsync, isPending } = useRegisterUser();
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Kreiraj korisnika
      </Typography>
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
