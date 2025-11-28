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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink, useLocation } from "react-router-dom";
import { FaHardHat } from "react-icons/fa";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { NAV_ITEMS } from "../routes/config";
import { useTranslation } from "react-i18next";

export const SIDEBAR_WIDTH = 250;

type Props = {
  mobileOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ mobileOpen, onClose }: Props) {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const tenant = useAuthStore((s) => s.tenant);
  const permissions = useAuthStore((s) => s.permissions || []);
  const { t } = useTranslation();

  const canSee = (guard?: { tenant?: "root" | "any"; permission?: string }) => {
    if (!guard) return true;
    if (guard.tenant === "root" && tenant !== "root") return false;
    if (guard.permission && !permissions.includes(guard.permission))
      return false;
    return true;
  };

  const MANAGEMENT = NAV_ITEMS.filter(
    (i) => i.section === "MANAGEMENT" && canSee(i.guard)
  );
  const SYSTEM = NAV_ITEMS.filter(
    (i) => i.section === "SYSTEM" && canSee(i.guard)
  );

  const MANAGEMENT_GRADILISTA = MANAGEMENT.filter(
    (i) => i.category === "CONSTRUCTION"
  );
  const MANAGEMENT_OSTALO = MANAGEMENT.filter(
    (i) => i.category !== "CONSTRUCTION"
  );

  const SYSTEM_SIFRARNIK = SYSTEM.filter((i) => i.category === "CODEBOOK");
  const SYSTEM_IDENTITET = SYSTEM.filter((i) => i.category === "IDENTITY");
  const SYSTEM_OSTALO = SYSTEM.filter(
    (i) =>
      !i.category || (i.category !== "CODEBOOK" && i.category !== "IDENTITY")
  );

  const renderSectionLabel = (key: string) => (
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
      {t(key as any)}
    </Typography>
  );

  const renderNavList = (
    items: { labelKey: string; to: string; icon: React.ReactNode }[]
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
              primary={t(it.labelKey as any)}
              primaryTypographyProps={{ fontWeight: active ? 700 : 500 }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );

  const renderAccordion = (title: string, items: typeof NAV_ITEMS) => {
    if (!items.length) return null;
    return (
      <Accordion
        disableGutters
        elevation={0}
        defaultExpanded
        square
        sx={{
          bgcolor: "transparent",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 2,
            minHeight: 40,
            "& .MuiAccordionSummary-content": { my: 0.5 },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {renderNavList(items)}
        </AccordionDetails>
      </Accordion>
    );
  };

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

  const ManagementContent = (
    <>
      {renderSectionLabel("sidebar.management")}
      {renderAccordion(t("sidebar.constructionGroup"), MANAGEMENT_GRADILISTA)}
      {renderNavList(MANAGEMENT_OSTALO)}
    </>
  );

  const SystemContent = (
    <>
      {renderSectionLabel("sidebar.system")}
      {renderAccordion(t("sidebar.codebookGroup"), SYSTEM_SIFRARNIK)}
      {renderAccordion(t("sidebar.identityGroup"), SYSTEM_IDENTITET)}
      {renderNavList(SYSTEM_OSTALO)}
    </>
  );

  const NavContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        //bgcolor: theme.palette.grey[50],
        bgcolor: "#F7F7F8",
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar disableGutters>
        <Brand />
      </Toolbar>

      <Box sx={{ flex: 1, overflowY: "auto", pb: 1, mt: 2 }}>
        {ManagementContent}
        {SystemContent}
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

        <Box sx={{ px: 0 }}>
          {ManagementContent}
          {SystemContent}
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
