import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useReadAllNotifications } from "../hooks/useReadAllNotifications";
import { notificationsKeys } from "../api/notifications.keys";
import type { NotificationDto } from "../../../lib/signalR/types";

type Props = {
  unreadTake: number;
  onAction?: () => void;
};

export function NotificationsActionsMenu({ unreadTake, onAction }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const readAllMutation = useReadAllNotifications();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleMarkAllRead = () => {
    readAllMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.setQueryData<NotificationDto[]>(
          notificationsKeys.unread(unreadTake),
          []
        );
      },
    });

    handleClose();
    onAction?.();
  };

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <MoreHorizIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleMarkAllRead}>
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("notifications.actions.markAllRead")} />
        </MenuItem>
      </Menu>
    </>
  );
}
