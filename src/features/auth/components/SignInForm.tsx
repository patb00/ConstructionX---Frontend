import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { FormEvent } from "react";

type Props = {
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
  serverError?: string;
};

export function SignInForm({
  className,
  onSubmit,
  isPending,
  serverError,
}: Props) {
  const hasError = Boolean(serverError);

  return (
    <Box component="form" className={className} onSubmit={onSubmit}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Prijava
      </Typography>
      <TextField
        size="small"
        fullWidth
        margin="normal"
        label="Oib"
        name="tenant"
        autoComplete="organization"
        required
        disabled={isPending}
      />
      <TextField
        size="small"
        fullWidth
        margin="normal"
        label="Username"
        name="username"
        autoComplete="username"
        required
        disabled={isPending}
        error={hasError}
      />
      <TextField
        size="small"
        fullWidth
        margin="normal"
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
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
        {isPending ? <CircularProgress size={20} color="inherit" /> : "Login"}
      </Button>
    </Box>
  );
}
