import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
  hasRequiredParams?: boolean;
  tenant: string;
  email: string;
  password: string;
  confirm: string;
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  serverError?: string;
};

export function ResetPasswordForm({
  className,
  onSubmit,
  isPending,
  hasRequiredParams,
  tenant,
  email,
  password,
  confirm,
  onPasswordChange,
  onConfirmChange,
  serverError,
}: Props) {
  const { t } = useTranslation();
  const hasError = Boolean(serverError);

  return (
    <Box component="form" className={className} onSubmit={onSubmit}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {t("auth.reset.title")}
      </Typography>

      {!hasRequiredParams && (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {t("auth.reset.invalidLink")}
        </Typography>
      )}

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label={t("auth.reset.tenantReadonly")}
        value={tenant}
        InputProps={{ readOnly: true }}
      />

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label={t("auth.fields.email")}
        value={email}
        InputProps={{ readOnly: true }}
      />

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label={t("auth.reset.newPassword")}
        type="password"
        name="password"
        autoComplete="new-password"
        required
        disabled={isPending || !hasRequiredParams}
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        error={hasError}
        helperText={hasError ? serverError : undefined}
      />

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label={t("auth.reset.confirmPassword")}
        type="password"
        name="confirm"
        autoComplete="new-password"
        required
        disabled={isPending || !hasRequiredParams}
        value={confirm}
        onChange={(e) => onConfirmChange(e.target.value)}
        error={hasError}
      />

      <Button
        type="submit"
        variant="contained"
        size="small"
        fullWidth
        sx={{ mt: 2, height: 36 }}
        disabled={isPending || !hasRequiredParams}
      >
        {isPending ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("auth.reset.submit")
        )}
      </Button>

      <Button
        fullWidth
        component={RouterLink}
        to="/"
        variant="outlined"
        size="small"
        sx={{ mt: 2, height: 36, color: "primary.main" }}
      >
        {t("auth.reset.back")}
      </Button>
    </Box>
  );
}
