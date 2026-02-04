export interface Notification {
  id: number;
  title: string;
  message: string;
  createdDate: string;
  isRead: boolean;
}


export type CreateNotificationRequest = {
  userIds: string[];
  createdByName?: string;
  title: string;
  message: string;
  actionUrl?: string;
  entityType?: string;
  entityId?: string;
};

export type { PagedResult } from "../../shared/types/api";
