import { Button, Paper, Stack, Typography } from "@mui/material";
import RoleForm from "./RoleForm";
import { useAddRole } from "../hooks/useAddRole";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function RoleCreatePage() {
  const { mutateAsync, isPending } = useAddRole();
  const navigate = useNavigate();
  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          Kreiraj ulogu
        </Typography>
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
