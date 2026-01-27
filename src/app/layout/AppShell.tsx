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
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MdConstruction } from "react-icons/md";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";

import Sidebar, { SIDEBAR_WIDTH } from "./sidebar/Sidebar";
import LanguageSwitcher from "../../components/ui/languague-switch/LanguagueSwitcher";
import { useUsers } from "../../features/administration/users/hooks/useUsers";
import { useTranslation } from "react-i18next";
import { getUserInitials } from "../../utils/getUserInitials";
import { ProfileDialog } from "../../components/ui/profile/ProfileDialog";
import { NotificationsBootstrap } from "../../features/notifications/components/NotificationsBootstrap";
import { NotificationsBell } from "../../features/notifications/components/NotificationsBell";
import { stopNotificationsHubConnection } from "../../lib/signalR/connection";

import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useAuthBootstrap } from "../../features/auth/hooks/useAuthBootstrap";

export default function AppShell() {
  useAuthBootstrap();

  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const { clear, userId, tenant, isAuthenticated, permissionsLoaded } =
    useAuthStore();

  const { usersRows } = useUsers();

  const loggedUser = useMemo(() => {
    if (!usersRows || !userId) return null;
    return usersRows.find((u: any) => String(u.id) === String(userId)) ?? null;
  }, [usersRows, userId]);

  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (!isMobile && open) setOpen(false);
  }, [isMobile, open]);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenProfile = () => {
    handleMenuClose();
    setProfileOpen(true);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await Promise.allSettled([stopNotificationsHubConnection()]);
    clear();
    queryClient.clear();
    enqueueSnackbar(t("appShell.snackbar.loggedOut"), { variant: "info" });
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {isAuthenticated && !permissionsLoaded && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            bgcolor: "background.default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {isAuthenticated && <NotificationsBootstrap />}

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#F7F7F8",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
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
              sx={{ fontSize: 24, color: "primary.main" }}
            />

            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "primary.main" }}
            ></Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LanguageSwitcher />
            <NotificationsBell />

            <Avatar
              onClick={handleAvatarClick}
              sx={{
                width: 28,
                height: 28,
                cursor: "pointer",
                bgcolor: "primary.main",
                fontSize: 14,
              }}
            >
              {getUserInitials(loggedUser)}
            </Avatar>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
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
          p: 2,
        }}
      >
        <Outlet />
      </Box>

      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        loggedUser={loggedUser}
        userId={userId}
        tenant={tenant}
      />
    </Box>
  );
}
