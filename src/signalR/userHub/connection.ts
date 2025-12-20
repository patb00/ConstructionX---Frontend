// signalR/userHub/connection.ts
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";
import { getSignalRJwt } from "../userHub/getSignalRJWT";

let conn: HubConnection | null = null;

export function getUserHubConnection(baseUrl: string): HubConnection {
    if (conn) return conn;

    conn = new HubConnectionBuilder()
        .withUrl(`${baseUrl}/hubs/user`, {
            accessTokenFactory: () => getSignalRJwt(),
            transport: HttpTransportType.WebSockets,
            skipNegotiation: true,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    return conn;
}

export async function stopUserHubConnection(): Promise<void> {
    if (!conn) return;
    const current = conn;
    conn = null;
    await current.stop();
}
