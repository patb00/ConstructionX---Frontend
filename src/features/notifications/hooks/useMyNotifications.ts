import { useQuery } from "@tanstack/react-query";

import { NotificationsApi } from "../api/notifications.api";
import { notificationsKeys } from "../api/notifications.keys";
import type { NotificationDto } from "../../../lib/signalR/types";
import type { PagedResult } from "..";

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

function mapPagedResultToDto(
  res: PagedResult<any>
): PagedResult<NotificationDto> {
  return {
    ...res,
    items: res.items.map(mapApiNotificationToDto),
  };
}

export function useMyNotifications(
  includeRead: boolean,
  page: number,
  pageSize: number
) {
  return useQuery<PagedResult<NotificationDto>>({
    queryKey: notificationsKeys.my(includeRead, page, pageSize),
    queryFn: async () => {
      const res = await NotificationsApi.getMy(includeRead, page, pageSize);
      return mapPagedResultToDto(res);
    },
    enabled: page > 0 && pageSize > 0,
  });
}
