import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHardHat,
  FaTools,
  FaTruck,
  FaUsers,
  FaHome,
  FaChartBar,
  FaCog,
  FaTachometerAlt,
  FaKey,
} from "react-icons/fa";
import { useTheme } from "@mui/material/styles";
import { IoIosBusiness } from "react-icons/io";

export const SIDEBAR_WIDTH = 250;

type Props = {
  mobileOpen: boolean;
  onClose: () => void;
};

const MANAGEMENT = [
  { label: "Nadzorna ploča", to: "/app/dashboard", icon: <FaTachometerAlt /> },
  /*   { label: "Gradilište", to: "/app/gradiliste", icon: <FaHardHat /> },
  { label: "Alat i oprema", to: "/app/alat", icon: <FaTools /> },
  { label: "Vozila", to: "/app/vozila", icon: <FaTruck /> },
  { label: "Ljudski resursi", to: "/app/ljudski", icon: <FaUsers /> },
  { label: "Stanovi", to: "/app/stanovi", icon: <FaHome /> },
  { label: "Izvješća", to: "/app/izvjestaji", icon: <FaChartBar /> }, */
];

const SYSTEM = [
  {
    label: "Tenanti",
    to: "/app/administration/tenants",
    icon: <FaKey />,
  },
  {
    label: "Tvrtke",
    to: "/app/administration/companies",
    icon: <IoIosBusiness />,
  },
];

export default function Sidebar({ mobileOpen, onClose }: Props) {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const renderSectionLabel = (text: string) => (
    <Typography
      variant="overline"
      sx={{
        color: theme.palette.text.secondary,
        px: 2,
        pt: 2,
        pb: 1,
        letterSpacing: 0.6,
      }}
    >
      {text}
    </Typography>
  );

  const renderNavList = (
    items: { label: string; to: string; icon: React.ReactNode }[]
  ) => (
    <List dense disablePadding>
      {items.map((it) => {
        const active = pathname.startsWith(it.to);
        return (
          <ListItemButton
            key={it.to}
            component={NavLink}
            to={it.to}
            onClick={onClose}
            sx={{
              mx: 1,
              borderRadius: 0.15,
              height: 40,
              color: active
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              bgcolor: active
                ? alpha(theme.palette.primary.main, 0.12)
                : "transparent",
              "&:hover": {
                bgcolor: active
                  ? alpha(theme.palette.primary.main, 0.18)
                  : alpha(theme.palette.text.primary, 0.04),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: active
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
            >
              {it.icon}
            </ListItemIcon>
            <ListItemText
              primary={it.label}
              primaryTypographyProps={{ fontWeight: active ? 700 : 500 }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );

  const Brand = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        height: 64,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 36,
          height: 36,
          borderRadius: 1,
          bgcolor: theme.palette.grey[200],
          color: theme.palette.primary.main,
        }}
      >
        <FaHardHat />
      </Box>
      {!isMobile && (
        <Typography sx={{ fontWeight: 700 }}>ConstructionX</Typography>
      )}
    </Box>
  );

  const NavContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        bgcolor: theme.palette.grey[50],
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar disableGutters>
        <Brand />
      </Toolbar>

      <Box sx={{ flex: 1, overflowY: "auto", pb: 1, mt: 2 }}>
        {renderSectionLabel("UPRAVLJANJE")}
        {renderNavList(MANAGEMENT)}

        {renderSectionLabel("SUSTAV")}
        {renderNavList(SYSTEM)}
      </Box>
    </Box>
  );

  const paperSx = {
    boxSizing: "border-box",
    width: SIDEBAR_WIDTH,
    overflowX: "hidden",
    borderRight: 0,
  } as const;

  if (isMobile) {
    return mobileOpen ? (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 999999,
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton aria-label="Close menu" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Box sx={{ px: 0 }}>{renderSectionLabel("UPRAVLJANJE")}</Box>
          {renderNavList(MANAGEMENT)}

          <Box sx={{ px: 0 }}>{renderSectionLabel("SUSTAV")}</Box>
          {renderNavList(SYSTEM)}
        </Box>
      </Box>
    ) : null;
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": paperSx,
      }}
    >
      {NavContent}
    </Drawer>
  );
}
