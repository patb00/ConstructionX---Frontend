import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { NotificationDto } from "../../../lib/signalR/types";
import { useMyUnreadNotifications } from "../hooks/useMyUnreadNotifications";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { useReadNotification } from "../hooks/useReadNotification";
import { notificationsKeys } from "../api/notifications.keys";
import { useQueryClient } from "@tanstack/react-query";

import { NotificationRow } from "./NotificationRow";
import { NotificationsActionsMenu } from "./NotificationsActionsMenu";
import { getNavigationPath } from "../utils/notificationNavigation";

type TabKey = "all" | "unread";

const UNREAD_TAKE = 10;
const UNREAD_TOP_TAKE = 6;

const EARLIER_PAGE_SIZE = 6;

export function NotificationsBell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const unreadQuery = useMyUnreadNotifications(UNREAD_TAKE);
  const unreadItems = unreadQuery.data ?? [];
  const unreadCount = unreadItems.length;

  const [tab, setTab] = useState<TabKey>("all");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [earlierPage, setEarlierPage] = useState(1);
  const [earlierAll, setEarlierAll] = useState<NotificationDto[]>([]);

  const earlierQuery = useMyNotifications(true, earlierPage, EARLIER_PAGE_SIZE);

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
    () => unreadItems.slice(0, UNREAD_TOP_TAKE),
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

  const readOneMutation = useReadNotification();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleClickItem = (n: NotificationDto) => {
    handleClose();

    queryClient.setQueryData<NotificationDto[]>(
      notificationsKeys.unread(UNREAD_TAKE),
      (prev) => (prev ?? []).filter((x) => x.id !== n.id)
    );

    if (!n.isRead) {
      readOneMutation.mutate(n.id);
    }

    if (n.actionUrl) {
      const path = getNavigationPath(n.actionUrl);
      if (path) {
        navigate(path);
      }
    }
  };

  const handleLoadEarlier = () => {
    if (earlierQuery.isFetching) return;
    if (!earlierQuery.data?.hasNext) return;
    setEarlierPage((p) => p + 1);
  };

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
            <Typography fontWeight={500} fontSize={22}>
              {t("notifications.title")}
            </Typography>

            <NotificationsActionsMenu
              unreadTake={UNREAD_TAKE}
              onAction={handleClose}
            />
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
            <Tab value="all" label={t("notifications.tabs.all")} />
            <Tab value="unread" label={t("notifications.tabs.unread")} />
          </Tabs>
        </Box>

        <Divider />

        <Box sx={{ py: 1 }}>
          {tab === "unread" && (
            <>
              {unreadTop.length === 0 ? (
                <MenuItem disabled sx={{ mx: 1, borderRadius: 1.5 }}>
                  <ListItemText primary={t("notifications.empty.unread")} />
                </MenuItem>
              ) : (
                unreadTop.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onClick={handleClickItem}
                    variant="menu"
                  />
                ))
              )}
            </>
          )}

          {tab === "all" && (
            <>
              {unreadTop.length > 0 && (
                <>
                  {unreadTop.map((n) => (
                    <NotificationRow
                      key={n.id}
                      notification={n}
                      onClick={handleClickItem}
                      variant="menu"
                    />
                  ))}
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
                <Typography fontWeight={400}>
                  {t("notifications.sections.earlier")}
                </Typography>
                <Button
                  size="small"
                  onClick={() => {
                    handleClose();
                    navigate("notifications");
                  }}
                  sx={{ textTransform: "none", fontWeight: 500 }}
                >
                  {t("notifications.actions.showAll")}
                </Button>
              </Box>

              {earlierFiltered.length === 0 ? (
                <MenuItem disabled sx={{ mx: 1, borderRadius: 1.5 }}>
                  <ListItemText primary={t("notifications.empty.earlier")} />
                </MenuItem>
              ) : (
                earlierFiltered.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onClick={handleClickItem}
                    variant="menu"
                  />
                ))
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
                    fontWeight: 500,
                    bgcolor: "grey.200",
                    color: "text.primary",
                    "&:hover": { bgcolor: "grey.300" },
                  }}
                >
                  {t("notifications.actions.loadEarlier")}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Menu>
    </>
  );
}
