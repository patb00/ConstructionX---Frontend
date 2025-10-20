import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useChangePassword } from "../../administration/users/hooks/useChangePassword";
import { useAuthStore } from "../../auth/store/useAuthStore";

type Props = { open: boolean; onDone: () => void; onLogout?: () => void };

export function ForceChangePasswordDialog({ open, onDone }: Props) {
  const userId = useAuthStore((s) => s.userId)!;
  const setMustChangePassword = useAuthStore((s) => s.setMustChangePassword);
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const [currentPassword] = useState("P@ssw0rd123!");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      return;
    }

    try {
      await changePassword({
        userId,
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setMustChangePassword(false);
      onDone();
    } catch (err: any) {}
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={(_e, reason) => {
        if (reason === "backdropClick") return;
      }}
      fullWidth
      PaperProps={{
        sx: { border: (t) => `1px solid ${t.palette.primary.main}` },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Potrebna je promjena lozinke</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2">
              Radi sigurnosti morate postaviti novu lozinku prije nastavka.
            </Typography>
            <TextField
              size="small"
              type="password"
              label="Nova lozinka"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              size="small"
              type="password"
              label="Potvrdite novu lozinku"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <Button
              fullWidth
              size="small"
              type="submit"
              variant="contained"
              disabled={isPending}
            >
              Spremi lozinku
            </Button>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
}
