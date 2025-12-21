// AppShell.tsx
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useMemo, useState } from "react";
import Sidebar, { SIDEBAR_WIDTH } from "./sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { MdConstruction } from "react-icons/md";
import { useSnackbar } from "notistack";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import LanguageSwitcher from "../../components/ui/languague-switch/LanguagueSwitcher";
import { useUsers } from "../../features/administration/users/hooks/useUsers";
import { useTranslation } from "react-i18next";
import { getUserInitials } from "../../utils/getUserInitials";
import { ProfileDialog } from "../../components/ui/profile/ProfileDialog";
import { NotificationsBootstrap } from "../../features/notifications/components/NotificationsBootstrap";

import { stopUserHubConnection } from "../../signalR/userHub/connection";
import { stopNotificationsHubConnection } from "../../signalR/notificationsHub/connection";

export default function AppShell() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { clear, userId, tenant } = useAuthStore();

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

  const handleLogout = async () => {
    handleMenuClose();

    // prekini hubove prije čišćenja state-a
    await Promise.allSettled([stopUserHubConnection(), stopNotificationsHubConnection()]);

    clear();
    queryClient.clear();
    enqueueSnackbar(t("appShell.snackbar.loggedOut"), { variant: "info" });
    navigate("/");
  };

  useEffect(() => {
    if (!isMobile && open) setOpen(false);
  }, [isMobile, open]);

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* NOTIFICATIONS HUB: /hubs/notifications */}
      <NotificationsBootstrap />

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
              onClick={handleAvatarClick}
              sx={{
                width: 28,
                height: 28,
                cursor: "pointer",
                bgcolor: "primary.main",
                color: "white",
                fontSize: 14,
                "&:hover": { opacity: 0.85 },
              }}
              aria-controls={menuOpen ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
            >
              {getUserInitials(loggedUser)}
            </Avatar>
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
          overflowY: open ? "hidden" : "auto",
          p: 2,
          background: "#FDFDFD",
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
