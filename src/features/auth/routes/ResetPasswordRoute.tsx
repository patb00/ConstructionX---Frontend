import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useSnackbar } from "notistack";
import "../styles/auth-landing.css";
import { AuthPanels } from "../components/AuthPanels";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
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
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    setServerError(undefined);

    if (!tenant || !email || !token) {
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

    const payload = {
      token: encodeURIComponent(token),
      email,
      newPassword: password,
      confirmNewPassword: confirm,
    };

    try {
      await resetPassword({ tenant, payload });
      navigate("/");
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.Messages?.[0] ||
        err?.Message ||
        "Neuspješan pokušaj promjene lozinke.";
      setServerError(String(msg));
    }
  };

  return (
    <Box className="container sign-up-mode">
      <Box className="forms-container">
        <Box className="signin-signup">
          <ResetPasswordForm
            className="sign-up-form"
            onSubmit={onSubmit}
            isPending={isPending}
            hasRequiredParams={hasRequiredParams}
            tenant={tenant}
            email={email}
            password={password}
            confirm={confirm}
            onPasswordChange={setPassword}
            onConfirmChange={setConfirm}
            serverError={serverError}
          />
        </Box>
      </Box>

      <Box className="panels-container">
        <AuthPanels
          mode="forgot-password"
          onSignIn={() => navigate("/")}
          onForgotPassword={() => {}}
        />
      </Box>
    </Box>
  );
}
