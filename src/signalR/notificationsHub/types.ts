// signalR/notificationsHub/types.ts

export type NotificationDto = {
    id: number;
    title: string;
    message: string;
    actionUrl?: string | null;
    entityType?: string | null;
    entityId?: string | null;
    isRead: boolean;
    createdDate: string; // ISO string (server DateTime)
    readDate?: string | null;
};

export type NotificationsBatchPayload = NotificationDto[];

export type NotificationsHubServerToClient = {
    ReceiveNotification: (n: NotificationDto) => void;
    ReceiveNotifications: (items: NotificationsBatchPayload) => void; // backlog
    UnreadCountChanged: (count: number) => void; // optional
};

export type NotificationsHubClientToServer = {
    // optional ako želiš eksplicitno tražiti backlog:
    RequestUnread: (take: number) => Promise<void>;
    MarkRead: (notificationId: number) => Promise<void>;
    MarkAllRead: () => Promise<void>;
};
