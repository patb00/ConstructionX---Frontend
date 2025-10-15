import { useState, type FormEvent } from "react";
import { Box } from "@mui/material";
import "../styles/auth-landing.css";
import { SignInForm } from "../components/SignInForm";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { AuthPanels } from "../components/AuthPanels";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForgotPassword } from "../../administration/users/hooks/useForgotPassword";

type AuthMode = "sign-in" | "forgot-password";

export default function LoginRoute() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const isForgot = mode === "forgot-password";

  const [tenant, setTenantState] = useState("");
  const setTenant = useAuthStore((s) => s.setTenant);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: doLogin, isPending } = useLogin(tenant || undefined);
  const { mutateAsync: doForgot, isPending: isForgotPending } =
    useForgotPassword();

  const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const form = new FormData(e.currentTarget);
    const formTenant = String(form.get("tenant") ?? "").trim();
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "").trim();

    if (!formTenant || !username || !password) {
      enqueueSnackbar("Molimo ispunite sve podatke.", { variant: "warning" });
      return;
    }

    try {
      setTenant(formTenant);
      if (tenant !== formTenant) setTenantState(formTenant);

      await doLogin({ username, password });
      enqueueSnackbar("Prijava uspješna!", { variant: "success" });
      navigate("/app/dashboard");
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.Messages?.[0] ||
        err?.Message ||
        "Neuspjela prijava.";
      enqueueSnackbar(String(msg), { variant: "error" });
    }
  };

  const onForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isForgotPending) return;

    const form = new FormData(e.currentTarget);
    const formTenant = String(form.get("tenant") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();

    if (!formTenant || !email) {
      enqueueSnackbar("Molimo unesite tenant i email.", { variant: "warning" });
      return;
    }

    try {
      setTenant(formTenant);
      if (tenant !== formTenant) setTenantState(formTenant);

      await doForgot({
        tenant: formTenant,
        payload: { email },
      });

      setMode("sign-in");
    } catch {}
  };

  return (
    <Box className={`container ${isForgot ? "sign-up-mode" : ""}`}>
      <Box className="forms-container">
        <Box className="signin-signup">
          <SignInForm
            className="sign-in-form"
            onSubmit={onSignIn}
            isPending={isPending}
            tenantValue={tenant}
            onTenantChange={setTenantState}
          />
          <ForgotPasswordForm
            className="sign-up-form"
            onSubmit={onForgotPassword}
            tenantValue={tenant}
            onTenantChange={setTenantState}
          />
        </Box>
      </Box>

      <Box className="panels-container">
        <AuthPanels
          mode={mode}
          onSignIn={() => setMode("sign-in")}
          onForgotPassword={() => setMode("forgot-password")}
        />
      </Box>
    </Box>
  );
}
