import { Box, Button, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  tenantValue?: string;
  onTenantChange?: (v: string) => void;
};

export function ForgotPasswordForm({
  className,
  onSubmit,
  tenantValue,
  onTenantChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <Box component="form" className={className} onSubmit={onSubmit}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {t("auth.forgot.title")}
      </Typography>

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label={t("auth.fields.tenant")}
        name="tenant"
        required
        value={tenantValue ?? ""}
        onChange={(e) => onTenantChange?.(e.target.value)}
      />

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label={t("auth.fields.email")}
        name="email"
        type="email"
        required
      />

      <Button
        type="submit"
        size="small"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        {t("auth.forgot.submit")}
      </Button>
    </Box>
  );
}
