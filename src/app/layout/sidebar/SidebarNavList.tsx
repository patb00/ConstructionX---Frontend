import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { NavItem } from "../../routes/navigation";

export type SidebarNavItem = Pick<NavItem, "labelKey" | "to" | "icon">;

type Props = {
  items: SidebarNavItem[];
  pathname: string;
  onClose: () => void;
};

export function SidebarNavList({ items, pathname, onClose }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
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
}
