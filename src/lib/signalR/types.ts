export type NotificationDto = {
  id: number;
  title: string;
  message: string;
  actionUrl?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  isRead: boolean;
  createdDate: string;
  createdByName?: string | null;
  readDate?: string | null;
};

export type NotificationsBatchPayload = NotificationDto[];

export type NotificationsHubServerToClient = {
  ReceiveNotification: (n: NotificationDto) => void;
  ReceiveNotifications: (items: NotificationsBatchPayload) => void;
  UnreadCountChanged: (count: number) => void;
};

export type NotificationsHubClientToServer = {
  RequestUnread: (take: number) => Promise<void>;
  MarkRead: (notificationId: number) => Promise<void>;
  MarkAllRead: () => Promise<void>;
};


