// src/components/ForgotPasswordForm.tsx
import { Box, Button, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";

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
  return (
    <Box component="form" className={className} onSubmit={onSubmit}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Zaboravljena lozinka?
      </Typography>

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label="Tenant"
        name="tenant"
        required
        value={tenantValue ?? ""}
        onChange={(e) => onTenantChange?.(e.target.value)}
      />

      <TextField
        size="small"
        fullWidth
        margin="normal"
        label="Email"
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
        Pošalji upute
      </Button>
    </Box>
  );
}
