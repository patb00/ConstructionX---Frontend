import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

const base = "/api/Notifications";

export const NotificationsApi = {
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
