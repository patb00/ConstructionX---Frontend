import { useQuery } from "@tanstack/react-query";
import { NotificationsApi } from "../api/notifications.api";
import { notificationsKeys } from "../api/notifications.keys";
import type { NotificationDto } from "../../../lib/signalR/types";

function mapApiNotificationToDto(n: any): NotificationDto {
  return {
    id: n.id,
    title: n.title,
    message: n.message,
    actionUrl: n.actionUrl ?? null,
    entityType: n.entityType ?? null,
    entityId: n.entityId ?? null,
    isRead: Boolean(n.isRead),
    createdDate: n.createdDate,
    readDate: n.readDate ?? null,
    createdByName: n.createdByName ?? null,
  };
}

export function useMyUnreadNotifications(take: number) {
  return useQuery<NotificationDto[]>({
    queryKey: notificationsKeys.unread(take),
    queryFn: async () => {
      const res = await NotificationsApi.getMyUnread(take);
      return res.map(mapApiNotificationToDto);
    },
    enabled: take > 0,
  });
}
