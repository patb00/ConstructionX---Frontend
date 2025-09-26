import { useState, type FormEvent } from "react";
import { Box } from "@mui/material";
import "../styles/auth-landing.css";
import { SignInForm } from "../components/SignInForm";
import { SignUpForm } from "../components/SignUpForm";
import { AuthPanels } from "../components/AuthPanels";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../model/auth.store";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

type AuthMode = "sign-in" | "sign-up";

export default function LoginRoute() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const isSignUp = mode === "sign-up";

  const setTenant = useAuthStore((s) => s.setTenant);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: doLogin, isPending } = useLogin();

  const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const form = new FormData(e.currentTarget);
    const tenant = String(form.get("tenant") ?? "").trim();
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "").trim();
    if (!tenant || !username || !password) return;

    try {
      setTenant(tenant);
      await doLogin({ username, password });
      enqueueSnackbar("Prijava uspješna!", { variant: "success" });
      navigate("/app/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      const body = err?.body;
      const msg =
        typeof body === "string"
          ? body
          : Array.isArray(body?.Messages)
          ? body.Messages.join("\n")
          : body?.Messages || body?.Message || "Neuspjela prijava.";
      enqueueSnackbar(String(msg), { variant: "error" });
    }
  };

  const onSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("sign up");
  };

  return (
    <Box className={`container ${isSignUp ? "sign-up-mode" : ""}`}>
      <Box className="forms-container">
        <Box className="signin-signup">
          <SignInForm
            className="sign-in-form"
            onSubmit={onSignIn}
            isPending={isPending}
          />
          <SignUpForm className="sign-up-form" onSubmit={onSignUp} />
        </Box>
      </Box>

      <Box className="panels-container">
        <AuthPanels
          mode={mode}
          onSignIn={() => setMode("sign-in")}
          onSignUp={() => setMode("sign-up")}
        />
      </Box>
    </Box>
  );
}
