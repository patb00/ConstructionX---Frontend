import { useQuery } from "@tanstack/react-query";
import { NotificationsApi } from "../api/notifications.api";
import { notificationsKeys } from "../api/notifications.keys";

export function useMyUnreadNotifications(take: number) {
  return useQuery<Notification[]>({
    queryKey: notificationsKeys.unread(take),
    queryFn: () => NotificationsApi.getMyUnread(take),
    enabled: take > 0,
  });
}
