// signalR/userHub/connection.ts
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let conn: HubConnection | null = null;

export function getUserHubConnection(args: {
    baseUrl: string;
    getAccessToken: () => string;
}): HubConnection {
    if (conn) return conn;

    conn = new HubConnectionBuilder()
        .withUrl(`${args.baseUrl}/hubs/user`, {
            accessTokenFactory: args.getAccessToken,
            transport: HttpTransportType.WebSockets,
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
