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
import { useTranslation } from "react-i18next";

type Props = { open: boolean; onDone: () => void; onLogout?: () => void };

export function ForceChangePasswordDialog({ open, onDone }: Props) {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.userId)!;
  const setMustChangePassword = useAuthStore((s) => s.setMustChangePassword);
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
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
        <DialogTitle>{t("auth.forcePasswordChange.title")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2">
              {t("auth.forcePasswordChange.message")}
            </Typography>
            <TextField
              size="small"
              type="password"
              label={t("auth.forcePasswordChange.currentPassword")}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <TextField
              size="small"
              type="password"
              label={t("auth.forcePasswordChange.newPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              size="small"
              type="password"
              label={t("auth.forcePasswordChange.confirmNewPassword")}
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
              {t("auth.forcePasswordChange.submit")}
            </Button>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
}
