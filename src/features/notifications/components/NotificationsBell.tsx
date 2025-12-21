import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import type { NotificationDto } from "../../../lib/signalR/types";
import { useReadAllNotifications } from "../hooks/useReadAllNotifications";
import { useMyUnreadNotifications } from "../hooks/useMyUnreadNotifications";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { notificationsKeys } from "../api/notifications.keys";

function fmt(dt: string) {
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

type TabKey = "all" | "unread";

export function NotificationsBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const unreadTake = 10;
  const unreadTopTake = 6;

  const earlierPageSize = 6;

  const unreadQuery = useMyUnreadNotifications(unreadTake);
  const unreadItems = unreadQuery.data ?? [];
  const unreadCount = unreadItems.length;

  const [tab, setTab] = useState<TabKey>("all");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [earlierPage, setEarlierPage] = useState(1);
  const [earlierAll, setEarlierAll] = useState<NotificationDto[]>([]);

  const earlierQuery = useMyNotifications(true, earlierPage, earlierPageSize);

  useEffect(() => {
    const pageItems = earlierQuery.data?.items ?? [];
    if (earlierPage === 1) {
      setEarlierAll(pageItems);
      return;
    }

    setEarlierAll((prev) => {
      const seen = new Set(prev.map((x) => x.id));
      const merged = [...prev];
      for (const n of pageItems) if (!seen.has(n.id)) merged.push(n);
      return merged;
    });
  }, [earlierQuery.data, earlierPage]);

  const unreadTop = useMemo(
    () => unreadItems.slice(0, unreadTopTake),
    [unreadItems]
  );

  const unreadTopIds = useMemo(
    () => new Set(unreadTop.map((x) => x.id)),
    [unreadTop]
  );

  const earlierFiltered = useMemo(
    () => earlierAll.filter((x) => !unreadTopIds.has(x.id)),
    [earlierAll, unreadTopIds]
  );

  const readAllMutation = useReadAllNotifications();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleClickItem = (n: NotificationDto) => {
    handleClose();

    queryClient.setQueryData<NotificationDto[]>(
      notificationsKeys.unread(unreadTake),
      (prev) => (prev ?? []).filter((x) => x.id !== n.id)
    );

    if (n.actionUrl) navigate(n.actionUrl);
  };

  const handleMarkAllRead = () => {
    handleClose();

    readAllMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.setQueryData<NotificationDto[]>(
          notificationsKeys.unread(unreadTake),
          []
        );
      },
    });
  };

  const handleLoadEarlier = () => {
    if (earlierQuery.isFetching) return;
    if (!earlierQuery.data?.hasNext) return;
    setEarlierPage((p) => p + 1);
  };

  const renderRow = (n: NotificationDto) => (
    <MenuItem
      key={n.id}
      onClick={() => handleClickItem(n)}
      sx={{
        alignItems: "flex-start",
        py: 1,
        px: 1.25,

        mx: 1,
        my: 0.25,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <ListItemIcon sx={{ minWidth: 44, mt: 0.25 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "grey.300",
            position: "relative",
            overflow: "hidden",
          }}
        >
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
        primary={
          <Typography variant="body2" sx={{ fontWeight: n.isRead ? 500 : 800 }}>
            {n.title}
          </Typography>
        }
        secondary={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Typography variant="body2" color="text.secondary">
              {n.message}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              {fmt(n.createdDate)}
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
    </MenuItem>
  );

  return (
    <>
      <IconButton onClick={handleOpen} aria-label="notifications">
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: "92vw",
            p: 0,
          },
        }}
      >
        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography fontWeight={800} fontSize={22}>
              Obavijesti
            </Typography>

            <IconButton size="small">
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              minHeight: 36,
              "& .MuiTab-root": {
                minHeight: 36,
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 999,
                px: 2,
                py: 0.5,
              },
              "& .MuiTab-root.Mui-selected": {
                bgcolor: "primary.main",
                color: "#fff",
              },
              "& .MuiTabs-flexContainer": { gap: 1 },
            }}
          >
            <Tab value="all" label="Sve" />
            <Tab value="unread" label="Nepročitano" />
          </Tabs>
        </Box>

        <Divider />

        <Box sx={{ py: 1 }}>
          {tab === "unread" && (
            <>
              {unreadTop.length === 0 ? (
                <MenuItem disabled sx={{ mx: 1, borderRadius: 1.5 }}>
                  <ListItemText primary="Nema nepročitanih obavijesti" />
                </MenuItem>
              ) : (
                unreadTop.map(renderRow)
              )}
            </>
          )}

          {tab === "all" && (
            <>
              {unreadTop.length > 0 && (
                <>
                  {unreadTop.map(renderRow)}
                  <Divider sx={{ my: 1 }} />
                </>
              )}

              <Box
                sx={{
                  px: 2,
                  pb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontWeight={800}>Starije</Typography>
                <Button
                  size="small"
                  onClick={() => {
                    handleClose();
                    navigate("/notifications");
                  }}
                  sx={{ textTransform: "none", fontWeight: 700 }}
                >
                  Prikaži sve
                </Button>
              </Box>

              {earlierFiltered.length === 0 ? (
                <MenuItem disabled sx={{ mx: 1, borderRadius: 1.5 }}>
                  <ListItemText primary="Nema starijih obavijesti" />
                </MenuItem>
              ) : (
                earlierFiltered.map(renderRow)
              )}

              <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  onClick={handleLoadEarlier}
                  disabled={
                    !earlierQuery.data?.hasNext || earlierQuery.isFetching
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    bgcolor: "grey.200",
                    color: "text.primary",
                    "&:hover": { bgcolor: "grey.300" },
                  }}
                >
                  Prikaži prethodne obavijesti
                </Button>
              </Box>
            </>
          )}
        </Box>

        <Divider />

        <MenuItem onClick={handleMarkAllRead} disabled={unreadCount === 0}>
          <ListItemIcon>
            <DoneAllIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Označi sve kao pročitano" />
        </MenuItem>
      </Menu>
    </>
  );
}
