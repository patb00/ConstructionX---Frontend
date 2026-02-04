import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChangePassword } from "../../../features/administration/users/hooks/useChangePassword";
import type { ChangePasswordRequest } from "../../../features/administration/users";
import { getUserInitials } from "../../../utils/getUserInitials";

type LoggedUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  userName?: string | null;
  phoneNumber?: string | null;
  isActive?: boolean;
};

type ProfileDialogProps = {
  open: boolean;
  onClose: () => void;
  loggedUser: LoggedUser | null;
  userId: string | null;
  tenant: string | null;
};

export function ProfileDialog({
  open,
  onClose,
  loggedUser,
  userId,
  tenant,
}: ProfileDialogProps) {
  const { t } = useTranslation();
  const { mutateAsync: changePassword } = useChangePassword();

  const fullName = useMemo(() => {
    if (!loggedUser) return "—";
    return (
      `${loggedUser.firstName ?? ""} ${loggedUser.lastName ?? ""}`.trim() ||
      loggedUser.userName ||
      "—"
    );
  }, [loggedUser]);

  const [openForm, setOpenForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canSubmit =
    Boolean(userId) &&
    currentPassword &&
    newPassword &&
    confirmNewPassword &&
    !saving;

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    setOpenForm(false);
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError(t("auth.reset.validation.noMatch"));
      return;
    }

    const payload: ChangePasswordRequest = {
      userId: userId!,
      currentPassword,
      newPassword,
      confirmNewPassword,
    };

    try {
      setSaving(true);
      await changePassword(payload);
      handleClose();
    } catch (e: any) {
      setError(e?.message || t("auth.changePassword.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {/* Header */}
      <Box
        sx={{
          px: 2.25,
          py: 1.75,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          background: "#FBFBFC",
        }}
      >
        <Typography fontWeight={700}>{t("appShell.menu.profile")}</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 2.25 }}>
        <Stack spacing={2}>
          {/* Profile card */}
          <Box sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>
                {getUserInitials(loggedUser)}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={700}>{fullName}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {loggedUser?.email ?? "—"}
                </Typography>
              </Box>

              <Chip
                size="small"
                label={
                  loggedUser?.isActive
                    ? t("appShell.profile.active")
                    : t("appShell.profile.inactive")
                }
                sx={(theme) => ({
                  fontWeight: 600,
                  color: theme.palette.common.white,
                  backgroundColor: loggedUser?.isActive
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                })}
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Row
              label={t("appShell.profile.username")}
              value={loggedUser?.userName ?? "—"}
            />
            <Row
              label={t("appShell.profile.phone")}
              value={loggedUser?.phoneNumber ?? "—"}
            />
            <Row label={t("appShell.profile.tenant")} value={tenant ?? "—"} />
          </Box>

          {/* Change password */}
          <Box sx={{ border: (t) => `1px solid ${t.palette.divider}` }}>
            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700}>
                  {t("auth.changePassword.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("auth.changePassword.description")}
                </Typography>
              </Box>

              <Button
                size="small"
                variant={openForm ? "outlined" : "contained"}
                onClick={() => setOpenForm((v) => !v)}
                sx={(theme) => ({
                  ...(openForm && {
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    "&:hover": {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: theme.palette.action.hover,
                    },
                  }),
                })}
              >
                {openForm
                  ? t("auth.changePassword.close")
                  : t("auth.changePassword.open")}
              </Button>
            </Box>

            <Collapse in={openForm} unmountOnExit>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  {error && <Alert severity="error">{error}</Alert>}

                  <TextField
                    size="small"
                    type="password"
                    label={t("auth.changePassword.currentPassword")}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <TextField
                    size="small"
                    type="password"
                    label={t("auth.changePassword.newPassword")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <TextField
                    size="small"
                    type="password"
                    label={t("auth.changePassword.confirmNewPassword")}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />

                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      size="small"
                      variant="contained"
                      disabled={!canSubmit}
                      onClick={handleSubmit}
                    >
                      {t("auth.changePassword.submit")}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Collapse>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
