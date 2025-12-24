export interface Notification {
  id: number;
  title: string;
  message: string;
  createdDate: string;
  isRead: boolean;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
