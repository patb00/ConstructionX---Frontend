import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

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
  role: string | null;
  permissions: string[] | null | undefined;
  refreshTokenExpirationDate: string | null;
  isAccessExpired: boolean;
};

const getUserInitials = (user: LoggedUser | null) => {
  if (!user) return "";

  const first = (user.firstName || "").trim();
  const last = (user.lastName || "").trim();

  if (!first && !last) return "";

  const firstInitial = first ? first[0] : "";
  const lastInitial = last ? last[0] : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export function ProfileDialog({
  open,
  onClose,
  loggedUser,
  userId,
  tenant,
  role,
  permissions,
  refreshTokenExpirationDate,
  isAccessExpired,
}: ProfileDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Close button like in DynamicDialog */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          backgroundColor: "#ffffff",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            backgroundColor: "#EFF6FF",
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 18, color: "#333" }} />
      </IconButton>

      <DialogTitle
        sx={{
          fontSize: 20,
          fontWeight: 600,
          pr: 6, // leave space for close button
        }}
      >
        {t("appShell.profile.title")}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Header: avatar + basic info */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              alt={t("appShell.userAvatarAlt")}
              sx={{
                width: 48,
                height: 48,
                bgcolor: "primary.main",
                color: "white",
                fontSize: 20,
              }}
            >
              {getUserInitials(loggedUser)}
            </Avatar>
            <Stack>
              <Typography variant="subtitle1" fontWeight={600}>
                {loggedUser
                  ? `${loggedUser.firstName ?? ""} ${
                      loggedUser.lastName ?? ""
                    }`.trim() ||
                    loggedUser.userName ||
                    "—"
                  : "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("appShell.profile.userId")}: {userId ?? "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("appShell.profile.tenant")}: {tenant ?? "—"}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          {/* User data */}
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              {t("appShell.profile.userData")}
            </Typography>
            <Typography variant="body2">
              {t("appShell.profile.firstName")}: {loggedUser?.firstName ?? "—"}
            </Typography>
            <Typography variant="body2">
              {t("appShell.profile.lastName")}: {loggedUser?.lastName ?? "—"}
            </Typography>
            <Typography variant="body2">
              {t("appShell.profile.email")}: {loggedUser?.email ?? "—"}
            </Typography>
            <Typography variant="body2">
              {t("appShell.profile.username")}: {loggedUser?.userName ?? "—"}
            </Typography>
            <Typography variant="body2">
              {t("appShell.profile.phone")}: {loggedUser?.phoneNumber ?? "—"}
            </Typography>
            <Typography variant="body2">
              {t("appShell.profile.status")}:{" "}
              {loggedUser
                ? loggedUser.isActive
                  ? t("appShell.profile.active")
                  : t("appShell.profile.inactive")
                : "—"}
            </Typography>
          </Stack>

          {/* Role */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t("appShell.profile.role")}
            </Typography>
            <Chip label={role ?? "—"} size="small" />
          </Stack>

          {/* Permissions */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t("appShell.profile.permissions", {
                count: permissions?.length ?? 0,
              })}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(permissions ?? []).length > 0 ? (
                permissions!.map((p) => (
                  <Chip key={p} label={p} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2">—</Typography>
              )}
            </Box>
          </Stack>

          <Divider />

          {/* Token status */}
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              {t("appShell.profile.tokenStatus")}
            </Typography>
            <Typography variant="body2">
              {t("appShell.profile.accessToken")}:{" "}
              {isAccessExpired
                ? t("appShell.profile.expired")
                : t("appShell.profile.active")}
            </Typography>
            <Typography variant="body2">
              {t("appShell.profile.refreshTokenExpires")}:{" "}
              {refreshTokenExpirationDate
                ? new Date(refreshTokenExpirationDate).toLocaleString()
                : "—"}
            </Typography>
          </Stack>

          {!loggedUser && (
            <Typography variant="body2" color="warning.main">
              {t("appShell.profile.notFound")}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t("appShell.profile.close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
