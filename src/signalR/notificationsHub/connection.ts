// signalR/notificationsHub/connection.ts
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";
import { getSignalRJwt } from "../notificationsHub/getSignalRJwt";

let conn: HubConnection | null = null;

export function getNotificationsHubConnection(baseUrl: string): HubConnection {
    if (conn) return conn;

    conn = new HubConnectionBuilder()
        // uskladi path s backendom: MapHub<NotificationHub>("/hubs/notifications")
        .withUrl(`${baseUrl}/hubs/notifications`, {
            accessTokenFactory: () => getSignalRJwt()
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    return conn;
}

export async function stopNotificationsHubConnection(): Promise<void> {
    if (!conn) return;
    const current = conn;
    conn = null;
    await current.stop();
}
