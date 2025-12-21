import { useQuery } from "@tanstack/react-query";
import type { PagedResult } from "../api/notifications.api";
import { NotificationsApi } from "../api/notifications.api";
import { notificationsKeys } from "../api/notifications.keys";

export function useMyNotifications(
  includeRead: boolean,
  page: number,
  pageSize: number
) {
  return useQuery<PagedResult<Notification>>({
    queryKey: notificationsKeys.my(includeRead, page, pageSize),
    queryFn: () => NotificationsApi.getMy(includeRead, page, pageSize),
    enabled: page > 0 && pageSize > 0,
  });
}
