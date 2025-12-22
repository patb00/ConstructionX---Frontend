import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { NotificationDto } from "../../../lib/signalR/types";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { useReadNotification } from "../hooks/useReadNotification";
import { notificationsKeys } from "../api/notifications.keys";

import { NotificationRow } from "./NotificationRow";
import { NotificationsActionsMenu } from "./NotificationsActionsMenu";

type TabKey = "all" | "unread";

const PAGE_SIZE = 10;
const UNREAD_TAKE_FOR_BELL = 10;

type TabState = {
  page: number;
  items: NotificationDto[];
};

const INITIAL_TAB_STATE: TabState = { page: 1, items: [] };

const NotificationsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<TabKey>("all");

  const [byTab, setByTab] = useState<Record<TabKey, TabState>>({
    all: { ...INITIAL_TAB_STATE },
    unread: { ...INITIAL_TAB_STATE },
  });

  const includeRead = tab === "all";
  const active = byTab[tab];

  const query = useMyNotifications(includeRead, active.page, PAGE_SIZE);
  const readOneMutation = useReadNotification();

  useEffect(() => {
    const pageItems = query.data?.items ?? [];

    setByTab((prev) => {
      const current = prev[tab];

      if (current.page === 1) {
        return {
          ...prev,
          [tab]: {
            ...current,
            items: pageItems,
          },
        };
      }

      const seen = new Set(current.items.map((x) => x.id));
      const merged = [...current.items];
      for (const n of pageItems) if (!seen.has(n.id)) merged.push(n);

      return {
        ...prev,
        [tab]: {
          ...current,
          items: merged,
        },
      };
    });
  }, [query.data, tab]);

  const hasNext = query.data?.hasNext ?? false;

  const handleLoadMore = () => {
    if (query.isFetching) return;
    if (!hasNext) return;

    setByTab((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        page: prev[tab].page + 1,
      },
    }));
  };

  const handleClickItem = (n: NotificationDto) => {
    setByTab((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        items: prev[tab].items.map((x) =>
          x.id === n.id
            ? {
                ...x,
                isRead: true,
                readDate: x.readDate ?? new Date().toISOString(),
              }
            : x
        ),
      },
    }));

    queryClient.setQueryData<NotificationDto[]>(
      notificationsKeys.unread(UNREAD_TAKE_FOR_BELL),
      (prev) => (prev ?? []).filter((x) => x.id !== n.id)
    );

    if (!n.isRead) {
      readOneMutation.mutate(n.id);
    }

    if (n.actionUrl) {
      const match = n.actionUrl.match(/construction-sites\/(\d+)/);
      if (match) {
        navigate(`/app/constructionSites/${match[1]}/details`);
      }
    }
  };

  const items = useMemo(() => byTab[tab].items, [byTab, tab]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
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
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              "& .MuiTabs-flexContainer": { gap: 1 },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 999,
                minHeight: 36,
                px: 2,
                py: 0.5,
              },
              "& .MuiTab-root.Mui-selected": {
                bgcolor: "primary.main",
                color: "#fff",
              },
            }}
          >
            <Tab value="all" label={t("notifications.tabs.all")} />
            <Tab value="unread" label={t("notifications.tabs.unread")} />
          </Tabs>

          <NotificationsActionsMenu unreadTake={UNREAD_TAKE_FOR_BELL} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {query.isLoading && active.page === 1 ? (
            <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={22} />
            </Box>
          ) : items.length === 0 ? (
            <Typography color="text.secondary" sx={{ px: 0.5, py: 1 }}>
              {tab === "unread"
                ? t("notifications.empty.noneUnread")
                : t("notifications.empty.noneAll")}
            </Typography>
          ) : (
            items.map((n) => (
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
              fontWeight: 800,
              bgcolor: "grey.200",
              color: "text.primary",
              "&:hover": { bgcolor: "grey.300" },
            }}
          >
            {query.isFetching && active.page > 1
              ? t("notifications.page.loading")
              : t("notifications.actions.loadEarlier")}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default NotificationsListPage;
