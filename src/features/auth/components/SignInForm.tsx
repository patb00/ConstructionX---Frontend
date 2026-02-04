import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
  serverError?: string;
  tenantValue?: string;
  onTenantChange?: (v: string) => void;
};

export function SignInForm({
  className,
  onSubmit,
  isPending,
  serverError,
  tenantValue = "",
  onTenantChange,
}: Props) {
  const { t } = useTranslation();
  const hasError = Boolean(serverError);

  return (
    <Box component="form" className={className} onSubmit={onSubmit}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {t("auth.login.title")}
      </Typography>

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label={t("auth.fields.tenant")}
        name="tenant"
        required
        disabled={isPending}
        value={tenantValue}
        onChange={(e) => onTenantChange?.(e.target.value)}
      />

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label={t("auth.fields.username")}
        name="username"
        required
        disabled={isPending}
        error={hasError}
      />

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label={t("auth.fields.password")}
        name="password"
        type="password"
        required
        disabled={isPending}
        error={hasError}
        helperText={hasError ? serverError : undefined}
      />

      <Button
        type="submit"
        variant="contained"
        size="small"
        fullWidth
        sx={{ mt: 2, height: 36 }}
        disabled={isPending}
      >
        {isPending ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("auth.login.submit")
        )}
      </Button>
    </Box>
  );
}
