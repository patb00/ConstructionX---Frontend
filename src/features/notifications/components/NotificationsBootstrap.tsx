// features/notifications/components/NotificationsBootstrap.tsx
import { useNotificationsHub } from "../../../signalR/notificationsHub/useNotificationsHub";

export function NotificationsBootstrap() {
    useNotificationsHub();
    return null;
}
