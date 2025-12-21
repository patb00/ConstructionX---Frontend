// features/notifications/components/NotificationsListDebug.tsx
import { useNotificationsStore } from "../store/useNotificationsStore";

export function NotificationsListDebug() {
    const items = useNotificationsStore((s) => s.items);
    const unread = useNotificationsStore((s) => s.unreadCount);

    return (
        <div>
            <div>Unread: <b>{unread}</b></div>
            <ul>
                {items.map((n) => (
                    <li key={n.id}>
                        <b>{n.title}</b> — {n.message} {n.isRead ? "" : "(unread)"}
                    </li>
                ))}
            </ul>
        </div>
    );
}
