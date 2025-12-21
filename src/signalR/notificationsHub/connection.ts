// signalR/notificationsHub/connection.ts
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";
import { getSignalRJwt } from "../userHub/getSignalRJWT";

let conn: HubConnection | null = null;

export function getNotificationsHubConnection(baseUrl: string): HubConnection {
    if (conn) return conn;

    conn = new HubConnectionBuilder()
        // uskladi path s backendom: MapHub<NotificationHub>("/hubs/notifications")
        .withUrl(`${baseUrl}/hubs/notifications`, {
            accessTokenFactory: () => getSignalRJwt(),
            transport: HttpTransportType.WebSockets,
            skipNegotiation: true,
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
