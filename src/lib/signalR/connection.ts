import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { getCookie } from "../cookie";

const ACCESS_COOKIE = "auth_jwt";

let conn: HubConnection | null = null;

function getAccessToken(): string {
  return getCookie(ACCESS_COOKIE) ?? "";
}

export function getNotificationsHubConnection(baseUrl: string): HubConnection {
  if (conn) return conn;

  conn = new HubConnectionBuilder()
    .withUrl(`${baseUrl}/hubs/notifications`, {
      accessTokenFactory: getAccessToken,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  return conn;
}

export async function startNotificationsHubConnection(
  baseUrl: string
): Promise<HubConnection> {
  const connection = getNotificationsHubConnection(baseUrl);

  if (connection.state === HubConnectionState.Disconnected) {
    await connection.start();
  }

  return connection;
}

export async function stopNotificationsHubConnection(): Promise<void> {
  if (!conn) return;

  const current = conn;
  conn = null;

  if (current.state !== HubConnectionState.Disconnected) {
    await current.stop();
  }
}
