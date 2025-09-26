import { Box, Button, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";

type Props = {
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function SignUpForm({ className, onSubmit }: Props) {
  return (
    <Box component="form" className={className} onSubmit={onSubmit}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Zaboravljena lozinka?
      </Typography>

      {/*       <Typography variant="body2" sx={{ mb: 2 }}>
        Unesite svoju e-poštu i poslat ćemo vam upute za ponovno postavljanje
        lozinke.
      </Typography> */}

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
