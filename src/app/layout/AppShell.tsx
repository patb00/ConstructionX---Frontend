import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMemo, useState } from "react";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { MdConstruction } from "react-icons/md";
import { useSnackbar } from "notistack";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import LanguageSwitcher from "../../components/ui/languague-switch/LanguagueSwitcher";
import { useUsers } from "../../features/administration/users/hooks/useUsers";
import { useTranslation } from "react-i18next";

export default function AppShell() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const signOut = useAuthStore((s) => s.clear);
  const userId = useAuthStore((s) => s.userId);
  const tenant = useAuthStore((s) => s.tenant);
  const role = useAuthStore((s) => s.role);
  const permissions = useAuthStore((s) => s.permissions);
  const refreshTokenExpirationDate = useAuthStore(
    (s) => s.refreshTokenExpirationDate
  );
  const isAccessExpired = useAuthStore((s) => s.isAccessExpired)();

  const { usersRows } = useUsers();

  const loggedUser = useMemo(() => {
    if (!usersRows || !userId) return null;
    return usersRows.find((u: any) => String(u.id) === String(userId)) ?? null;
  }, [usersRows, userId]);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenProfile = () => {
    handleMenuClose();
    setProfileOpen(true);
  };

  const handleLogout = () => {
    handleMenuClose();
    signOut();
    queryClient.clear();
    enqueueSnackbar(t("appShell.snackbar.loggedOut"), { variant: "info" });
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={(theme) => ({
          bgcolor: "#F7F7F8",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          zIndex: (t) => t.zIndex.drawer + 1,
        })}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setOpen(true)}
              sx={{ mr: 1, display: { md: "none" } }}
              aria-label={t("appShell.a11y.openMenu")}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component={MdConstruction}
              sx={(theme) => ({
                fontSize: 24,
                color: theme.palette.primary.main,
              })}
            />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
                color: "primary.main",
              }}
            >
              ConstructionX
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LanguageSwitcher />
            <Avatar
              alt={t("appShell.userAvatarAlt")}
              src="/avatar-placeholder.png"
              onClick={handleAvatarClick}
              sx={{
                width: 28,
                height: 28,
                cursor: "pointer",
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { opacity: 0.85 },
              }}
              aria-controls={menuOpen ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
            />
          </Box>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            MenuListProps={{ dense: true, autoFocusItem: false }}
            sx={{ "& .MuiPaper-root": { borderRadius: 0.15 } }}
          >
            <MenuItem onClick={handleOpenProfile}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t("appShell.menu.profile")} />
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t("appShell.menu.logout")} />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          mt: "64px",
          ml: { md: `${SIDEBAR_WIDTH}px` },
          width: "100%",
          maxWidth: "100%",
          overflowX: "clip",
          p: 2,
          background: "#FDFDFD",
        }}
      >
        <Outlet />
      </Box>

      <Dialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t("appShell.profile.title")}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                alt={t("appShell.userAvatarAlt")}
                src="/avatar-placeholder.png"
                sx={{ width: 48, height: 48 }}
              />
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

            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {t("appShell.profile.userData")}
              </Typography>
              <Typography variant="body2">
                {t("appShell.profile.firstName")}:{" "}
                {loggedUser?.firstName ?? "—"}
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

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                {t("appShell.profile.role")}
              </Typography>
              <Chip label={role ?? "—"} size="small" />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                {t("appShell.profile.permissions", {
                  count: permissions?.length ?? 0,
                })}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(permissions ?? []).length > 0 ? (
                  permissions.map((p) => (
                    <Chip key={p} label={p} size="small" variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body2">—</Typography>
                )}
              </Box>
            </Stack>

            <Divider />

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
          <Button onClick={() => setProfileOpen(false)}>
            {t("appShell.profile.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
