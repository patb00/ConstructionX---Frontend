import * as React from "react";
import { IconButton, Stack, Typography, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { SnackbarKey } from "notistack";
import { SnackbarContent } from "notistack";
import type { NotificationDto } from "../../../lib/signalR/types";

type Props = {
  id: SnackbarKey;
  notification: NotificationDto;
  onClose: (id: SnackbarKey) => void;
  onOpen?: (notification: NotificationDto) => void;
};

export const NotificationToast = React.forwardRef<HTMLDivElement, Props>(
  function NotificationToast({ id, notification, onClose, onOpen }, ref) {
    return (
      <SnackbarContent ref={ref}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            width: 360,
            p: 2,
            bgcolor: "#fff",
            color: theme.palette.text.primary,

            // Accent border
            borderLeft: `4px solid ${theme.palette.primary.main}`,

            // 💎 deep shadow + soft primary glow
            boxShadow: `
              0px 10px 28px rgba(0, 0, 0, 0.12),
              0px 4px 12px rgba(0, 0, 0, 0.08),
              0px 0px 0px 1px ${theme.palette.primary.main}20,
              0px 0px 12px ${theme.palette.primary.main}25
            `,

            transition: "transform 0.15s ease, box-shadow 0.15s ease",

            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: `
                0px 14px 34px rgba(0, 0, 0, 0.14),
                0px 6px 16px rgba(0, 0, 0, 0.1),
                0px 0px 0px 1px ${theme.palette.primary.main}30,
                0px 0px 16px ${theme.palette.primary.main}35
              `,
            },
          })}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={1.5}
          >
            <Stack spacing={0.5} sx={{ pr: 1 }}>
              {notification.title ? (
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, lineHeight: 1.3 }}
                >
                  {notification.title}
                </Typography>
              ) : null}

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.4 }}
              >
                {notification.message}
              </Typography>
            </Stack>

            <IconButton
              size="small"
              onClick={() => onClose(id)}
              sx={{
                mt: -0.5,
                color: "grey.500",
                "&:hover": {
                  color: "grey.700",
                  bgcolor: "transparent",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          {onOpen ? (
            <Typography
              role="button"
              tabIndex={0}
              onClick={() => onOpen(notification)}
              onKeyDown={(e) =>
                e.key === "Enter" ? onOpen(notification) : null
              }
              sx={(theme) => ({
                mt: 1.25,
                fontSize: 13,
                fontWeight: 500,
                color: theme.palette.primary.main,
                cursor: "pointer",
                alignSelf: "flex-start",

                "&:hover": {
                  textDecoration: "underline",
                },
              })}
            >
              Open
            </Typography>
          ) : null}
        </Paper>
      </SnackbarContent>
    );
  }
);
