import { Drawer, Box, Toolbar, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SidebarBrand } from "./SidebarBrand";
import { SidebarSection } from "./SidebarSection";
import { canSeeItem } from "./SidebarGuard";
import { FaCarSide, FaListUl, FaUserShield, FaTools } from "react-icons/fa";
import { LuConstruction } from "react-icons/lu";
import { useAuthStore } from "../../../features/auth/store/useAuthStore";
import { NAV_ITEMS, type NavItem } from "../../routes/navigation";

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

  const canSee = (guard?: NavItem["guard"]) =>
    canSeeItem(guard, tenant, permissions);

  const MANAGEMENT: NavItem[] = NAV_ITEMS.filter(
    (i) => i.section === "MANAGEMENT" && canSee(i.guard)
  );

  const SYSTEM: NavItem[] = NAV_ITEMS.filter(
    (i) => i.section === "SYSTEM" && canSee(i.guard)
  );

  const MANAGEMENT_CONSTRUCTION = MANAGEMENT.filter(
    (i) => i.category === "CONSTRUCTION"
  );

  const SYSTEM_VEHICLES = SYSTEM.filter((i) => i.category === "VEHICLES");
  const SYSTEM_CODEBOOK = SYSTEM.filter((i) => i.category === "CODEBOOK");
  const SYSTEM_TOOLS = SYSTEM.filter((i) => i.category === "TOOLS");
  const SYSTEM_IDENTITY = SYSTEM.filter((i) => i.category === "IDENTITY");

  const ManagementContent = (
    <SidebarSection
      sectionLabelKey="sidebar.management"
      accordion={[
        {
          title: t("sidebar.constructionGroup"),
          icon: <LuConstruction />,
          items: MANAGEMENT_CONSTRUCTION,
        },
      ]}
      listItems={[]}
      pathname={pathname}
      onClose={onClose}
    />
  );

  const SystemContent = (
    <SidebarSection
      sectionLabelKey="sidebar.system"
      accordion={[
        {
          title: t("sidebar.vehiclesGroup"),
          icon: <FaCarSide />,
          items: SYSTEM_VEHICLES,
        },
        {
          title: t("sidebar.toolsGroup"),
          icon: <FaTools />,
          items: SYSTEM_TOOLS,
        },
        {
          title: t("sidebar.codebookGroup"),
          icon: <FaListUl />,
          items: SYSTEM_CODEBOOK,
        },

        {
          title: t("sidebar.identityGroup"),
          icon: <FaUserShield />,
          items: SYSTEM_IDENTITY,
        },
      ]}
      listItems={[]}
      pathname={pathname}
      onClose={onClose}
    />
  );

  const NavContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        bgcolor: "#F7F7F8",
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar disableGutters>
        <SidebarBrand isMobile={isMobile} />
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
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (t) => t.zIndex.drawer + 1,
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

        <Box sx={{ flex: 1, overflowY: "auto", px: 0 }}>
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
