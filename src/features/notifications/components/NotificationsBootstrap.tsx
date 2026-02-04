import { useEffect, useMemo } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";

import {
  getNotificationsHubConnection,
  stopNotificationsHubConnection,
} from "../../../lib/signalR/connection";
import type { NotificationDto } from "../../../lib/signalR/types";
import { notificationsKeys } from "../api/notifications.keys";
import { NotificationToast } from "../../../components/ui/notification-toast/NotificationToast";
import { NotificationsApi } from "../api/notifications.api";

const UNREAD_TAKE = 10;

export function NotificationsBootstrap() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const conn = useMemo(() => getNotificationsHubConnection(baseUrl), [baseUrl]);

  useEffect(() => {
    const onReceiveNotification = (n: NotificationDto) => {
      queryClient.setQueryData<NotificationDto[]>(
        notificationsKeys.unread(UNREAD_TAKE),
        (prev) => {
          const current = prev ?? [];
          if (current.some((x) => x.id === n.id)) return current;
          return [n, ...current].slice(0, UNREAD_TAKE);
        }
      );

      enqueueSnackbar("", {
        variant: "default",
        autoHideDuration: 15000,
        content: (key) => (
          <NotificationToast
            id={key}
            notification={n}
            onClose={closeSnackbar}
            onOpen={(notification) => {
              closeSnackbar(key);

              queryClient.setQueryData<NotificationDto[]>(
                notificationsKeys.unread(UNREAD_TAKE),
                (prev) => (prev ?? []).filter((x) => x.id !== notification.id)
              );

              if (!notification.isRead) {
                void NotificationsApi.read(notification.id);
              }

              if (notification.actionUrl) {
                const normalized = notification.actionUrl.replace(
                  /^\/?construction-sites\/(\d+)/,
                  "/app/constructionSites/$1"
                );

                window.location.href = `${normalized}/details`;
              }
            }}
          />
        ),
      });
    };

    conn.on("ReceiveNotification", onReceiveNotification);

    (async () => {
      try {
        if (conn.state === HubConnectionState.Disconnected) {
          await conn.start();
          console.log("[NotificationsHub] connected", conn.connectionId);
        }
      } catch (err) {
        console.error("[NotificationsHub] START FAILED", err);
      }
    })();

    return () => {
      conn.off("ReceiveNotification", onReceiveNotification);
    };
  }, [conn, enqueueSnackbar, closeSnackbar, queryClient]);

  useEffect(() => {
    return () => {
      void stopNotificationsHubConnection();
    };
  }, []);

  return null;
}
