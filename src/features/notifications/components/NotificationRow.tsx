import {
  Avatar,
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import type { NotificationDto } from "../../../lib/signalR/types";
import { formatNotificationDate } from "../utils/formatNotificationDate";
import { getInitials } from "../utils/getInitals";

type Props = {
  notification: NotificationDto;
  onClick?: (n: NotificationDto) => void;
  variant?: "menu" | "list";
};

export function NotificationRow({
  notification: n,
  onClick,
  variant = "menu",
}: Props) {
  const content = (
    <>
      <ListItemIcon sx={{ minWidth: 44, mt: 0.25 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "grey.300",
              color: "text.primary",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {n.createdByName ? getInitials(n.createdByName) : "?"}
          </Avatar>

          <Box
            sx={{
              position: "absolute",
              right: -2,
              bottom: -2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              bgcolor: "primary.main",
              border: "2px solid #fff",
            }}
          />
        </Box>
      </ListItemIcon>

      <ListItemText
        // ✅ important: allow it to shrink and wrap inside flex row
        sx={{ minWidth: 0 }}
        secondaryTypographyProps={{ component: "div" }}
        primary={
          <Typography
            variant="body2"
            fontWeight={n.isRead ? 500 : 800}
            sx={{
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              lineHeight: 1.25,
            }}
          >
            {n.title}
          </Typography>
        }
        secondary={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: "normal",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                lineHeight: 1.25,
              }}
            >
              {n.message}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              {formatNotificationDate(n.createdDate)}
            </Typography>
          </Box>
        }
      />

      <Box sx={{ pt: 0.75, pl: 1 }}>
        <FiberManualRecordIcon
          sx={{ fontSize: 10 }}
          color={n.isRead ? "disabled" : "primary"}
        />
      </Box>
    </>
  );

  if (variant === "list") {
    return (
      <Box
        onClick={() => onClick?.(n)}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          p: 1.25,
          borderRadius: 2,
          cursor: n.actionUrl ? "pointer" : "default",
          bgcolor: n.isRead ? "transparent" : "action.hover",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <MenuItem
      onClick={() => onClick?.(n)}
      sx={{
        alignItems: "flex-start",
        gap: 1.25,
        py: 1,
        px: 1.25,
        mx: 1,
        my: 0.25,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      {content}
    </MenuItem>
  );
}
