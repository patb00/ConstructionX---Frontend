export interface Notification {
  id: number;
  title: string;
  message: string;
  createdDate: string;
  isRead: boolean;
}

export type { PagedResult } from "../../shared/types/api";
