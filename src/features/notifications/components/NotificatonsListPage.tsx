import { useEffect, useMemo, useState } from "react";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { NotificationDto } from "../../../lib/signalR/types";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { useReadNotification } from "../hooks/useReadNotification";
import { notificationsKeys } from "../api/notifications.keys";

import { NotificationRow } from "./NotificationRow";
import { NotificationsActionsMenu } from "./NotificationsActionsMenu";
import { getNavigationPath } from "../utils/notificationNavigation";
import { PillTabs } from "../../../components/ui/tabs/PillTabs";
import CreateNotificationDialog from "./CreateNotificationDialog";

const PAGE_SIZE = 10;
const UNREAD_TAKE_FOR_BELL = 10;

type TabKey =
  | "all"
  | "unread"
  | "construction"
  | "vehicles"
  | "tools"
  | "hr"
  | "system";

type TabState = {
  page: number;
  items: NotificationDto[];
};

const INITIAL_TAB_STATE: TabState = { page: 1, items: [] };

function checkCategory(n: NotificationDto, tab: TabKey): boolean {
  if (tab === "all" || tab === "unread") return true;
  const t = n.entityType || "";
  if (tab === "construction") return t.startsWith("Construction");
  if (tab === "vehicles") return t.startsWith("Vehicle");
  if (tab === "tools") return t.startsWith("Tool");
  if (tab === "hr")
    return (
      t.startsWith("Medical") ||
      t.startsWith("Certification") ||
      t.startsWith("Employee")
    );
  if (tab === "system") return t.startsWith("System");
  return false;
}

const NotificationsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<TabKey>("all");
  const isUnreadTab = tab === "unread";
  const [openCreateNotif, setOpenCreateNotif] = useState(false);

  const [streams, setStreams] = useState<{
    all: TabState;
    unread: TabState;
  }>({
    all: { ...INITIAL_TAB_STATE },
    unread: { ...INITIAL_TAB_STATE },
  });

  const activeStreamKey = isUnreadTab ? "unread" : "all";
  const activeStream = streams[activeStreamKey];

  const query = useMyNotifications(!isUnreadTab, activeStream.page, PAGE_SIZE);

  const readOneMutation = useReadNotification();

  useEffect(() => {
    const pageItems = query.data?.items ?? [];

    setStreams((prev) => {
      const current = prev[activeStreamKey];

      if (current.page === 1) {
        return {
          ...prev,
          [activeStreamKey]: { ...current, items: pageItems },
        };
      }

      const seen = new Set(current.items.map((x) => x.id));
      const merged = [...current.items];
      for (const n of pageItems) if (!seen.has(n.id)) merged.push(n);

      return {
        ...prev,
        [activeStreamKey]: { ...current, items: merged },
      };
    });
  }, [query.data, activeStreamKey]);

  const hasNext = query.data?.hasNext ?? false;

  const handleLoadMore = () => {
    if (query.isFetching) return;
    if (!hasNext) return;

    setStreams((prev) => ({
      ...prev,
      [activeStreamKey]: {
        ...prev[activeStreamKey],
        page: prev[activeStreamKey].page + 1,
      },
    }));
  };

  const handleClickItem = (n: NotificationDto) => {
    setStreams((prev) => ({
      all: {
        ...prev.all,
        items: prev.all.items.map((x) =>
          x.id === n.id
            ? {
                ...x,
                isRead: true,
                readDate: x.readDate ?? new Date().toISOString(),
              }
            : x,
        ),
      },
      unread: {
        ...prev.unread,
        items: prev.unread.items.map((x) =>
          x.id === n.id
            ? {
                ...x,
                isRead: true,
                readDate: x.readDate ?? new Date().toISOString(),
              }
            : x,
        ),
      },
    }));

    queryClient.setQueryData<NotificationDto[]>(
      notificationsKeys.unread(UNREAD_TAKE_FOR_BELL),
      (prev) => (prev ?? []).filter((x) => x.id !== n.id),
    );

    if (!n.isRead) {
      readOneMutation.mutate(n.id);
    }

    if (n.actionUrl) {
      const path = getNavigationPath(n);
      if (path) {
        navigate(path);
      }
    }
  };

  const visibleItems = useMemo(() => {
    return activeStream.items.filter((n) => checkCategory(n, tab));
  }, [activeStream.items, tab]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {t("notifications.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("notifications.page.subtitle")}
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpenCreateNotif(true)}>
          {t("notifications.create.button")}
        </Button>
      </Box>

      <Card
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            gap: 1,
          }}
        >
          <PillTabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            items={[
              { value: "all", label: t("notifications.tabs.all") },
              { value: "unread", label: t("notifications.tabs.unread") },
              {
                value: "construction",
                label: t("notifications.tabs.construction"),
              },
              { value: "vehicles", label: t("notifications.tabs.vehicles") },
              { value: "tools", label: t("notifications.tabs.tools") },
              { value: "hr", label: t("notifications.tabs.hr") },
              { value: "system", label: t("notifications.tabs.system") },
            ]}
          />

          <NotificationsActionsMenu unreadTake={UNREAD_TAKE_FOR_BELL} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {query.isLoading && activeStream.page === 1 ? (
            <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={22} />
            </Box>
          ) : visibleItems.length === 0 ? (
            <Typography color="text.secondary" sx={{ px: 0.5, py: 1 }}>
              {tab === "unread"
                ? t("notifications.empty.noneUnread")
                : t("notifications.empty.noneAll")}
            </Typography>
          ) : (
            visibleItems.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onClick={handleClickItem}
                variant="list"
              />
            ))
          )}
        </Box>

        <Box sx={{ pt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={handleLoadMore}
            disabled={!hasNext || query.isFetching}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              bgcolor: "grey.200",
              color: "text.primary",
              "&:hover": { bgcolor: "grey.300" },
            }}
          >
            {query.isFetching && activeStream.page > 1
              ? t("notifications.page.loading")
              : t("notifications.actions.loadEarlier")}
          </Button>
        </Box>
      </Card>

      {openCreateNotif && (
        <CreateNotificationDialog
          open={openCreateNotif}
          onClose={() => setOpenCreateNotif(false)}
        />
      )}
    </Box>
  );
};

export default NotificationsListPage;
