import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useSnackbar } from "notistack";

import { useAuthStore } from "../store/useAuthStore";
import { useResetPassword } from "../../administration/users/hooks/useResetPassword";

export default function ResetPasswordRoute() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const setTenantStore = useAuthStore((s) => s.setTenant);

  const token =
    params.get("token") || params.get("resetToken") || params.get("code") || "";
  const email = params.get("email") || "";
  const tenant = params.get("tenant") || "";

  const hasRequiredParams = useMemo(
    () => Boolean(token && email && tenant),
    [token, email, tenant]
  );

  useEffect(() => {
    if (tenant) setTenantStore(tenant);
  }, [tenant, setTenantStore]);

  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    if (!hasRequiredParams) {
      enqueueSnackbar("Nedostaju parametri u poveznici (tenant/email/token).", {
        variant: "error",
      });
      return;
    }

    if (!password || !confirm) {
      enqueueSnackbar("Unesite i potvrdite novu lozinku.", {
        variant: "warning",
      });
      return;
    }

    if (password !== confirm) {
      enqueueSnackbar("Lozinke se ne podudaraju.", { variant: "warning" });
      return;
    }

    if (password.length < 8) {
      enqueueSnackbar("Lozinka mora imati najmanje 8 znakova.", {
        variant: "warning",
      });
      return;
    }

    try {
      await resetPassword({
        tenant,
        payload: {
          token,
          email,
          newPassword: password,
          confirmNewPassword: confirm,
        },
      });

      navigate("/");
    } catch {}
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Postavi novu lozinku
        </Typography>

        {!hasRequiredParams && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            Poveznica je nevažeća ili nepotpuna. Zatražite novu poveznicu za
            reset lozinke.
          </Typography>
        )}

        <TextField
          label="Tenant"
          value={tenant}
          InputProps={{ readOnly: true }}
          fullWidth
          size="small"
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          InputProps={{ readOnly: true }}
          fullWidth
          size="small"
          margin="normal"
        />

        <TextField
          label="Nova lozinka"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          size="small"
          margin="normal"
          required
        />

        <TextField
          label="Potvrda lozinke"
          type="password"
          name="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          fullWidth
          size="small"
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isPending || !hasRequiredParams}
        >
          {isPending ? "Spremanje…" : "Spremi novu lozinku"}
        </Button>

        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          sx={{ mt: 1, display: "block", textAlign: "center" }}
        >
          Povratak na prijavu
        </Link>
      </Box>
    </Box>
  );
}
