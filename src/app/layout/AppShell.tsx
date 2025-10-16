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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import { useState } from "react";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { MdConstruction } from "react-icons/md";
import { useSnackbar } from "notistack";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const signOut = useAuthStore((s) => s.clear);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    signOut();
    queryClient.clear();
    enqueueSnackbar("Odjavljeni ste.", { variant: "info" });
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={(theme) => ({
          bgcolor: theme.palette.grey[50],
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
              aria-label="Otvori izbornik"
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

          <Avatar
            alt="Korisnik"
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
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            MenuListProps={{ dense: true }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 0.15,
              },
            }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Odjava" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,

          mt: "64px",
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          ml: { md: `${SIDEBAR_WIDTH}px` },
          p: 2,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
