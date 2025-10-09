import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAddTenant } from "../hooks/useAddTenant";
import TenantForm from "./TenantForm";

export default function TenantCreatePage() {
  const { mutateAsync, isPending } = useAddTenant();
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
          Kreiraj tenanta
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/tenants")}
          sx={{ color: "primary.main" }}
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
        <TenantForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
