import type { PagedResult } from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/Notifications";

export const NotificationsApi = {
  read: async (notificationId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${notificationId}/read`, {
      method: "POST",
    });
  },

  readAll: async () => {
    return authFetch<ApiEnvelope<string>>(`${base}/read-all`, {
      method: "POST",
    });
  },

  getMy: async (
    includeRead: boolean,
    page: number,
    pageSize: number
  ): Promise<PagedResult<Notification>> => {
    const res = await authFetch<ApiEnvelope<PagedResult<Notification>>>(
      `${base}/my?IncludeRead=${includeRead}&Page=${page}&PageSize=${pageSize}`
    );
    return res.data;
  },

  getMyUnread: async (take: number): Promise<Notification[]> => {
    const res = await authFetch<ApiEnvelope<Notification[]>>(
      `${base}/my-unread?Take=${take}`
    );
    return res.data;
  },
};
