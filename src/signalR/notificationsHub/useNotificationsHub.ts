// signalR/notificationsHub/useNotificationsHub.ts
import { useEffect, useMemo, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { getNotificationsHubConnection } from "./connection";
import { useNotificationsStore } from "../../features/notifications/store/useNotificationsStore";
import type { NotificationDto } from "./types";

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

export function useNotificationsHub() {
    const [isConnected, setIsConnected] = useState(false);

    const jwt = useAuthStore((s) => s.jwt); // re-render kad se login/logout dogodi
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

    const conn = useMemo(() => getNotificationsHubConnection(baseUrl), [baseUrl]);

    const upsertMany = useNotificationsStore((s) => s.upsertMany);
    const push = useNotificationsStore((s) => s.push);
    const reset = useNotificationsStore((s) => s.reset);

    useEffect(() => {
        let disposed = false;

        const onReceiveNotification = (n: NotificationDto) => push(n);
        const onReceiveNotifications = (items: NotificationDto[]) => upsertMany(items);
        const onUnreadCountChanged = (count: number) => {
            // opcionalno: ako želiš hard sync count
            // najjednostavnije: ignoriraj i računaj iz items
            void count;
        };

        conn.on("ReceiveNotification", onReceiveNotification);
        conn.on("ReceiveNotifications", onReceiveNotifications);
        conn.on("UnreadCountChanged", onUnreadCountChanged);

        conn.onclose(() => setIsConnected(false));
        conn.onreconnecting(() => setIsConnected(false));
        conn.onreconnected(() => setIsConnected(true));

        (async () => {
            try {
                if (!jwt) {
                    // logout / nema tokena
                    if (conn.state !== HubConnectionState.Disconnected) {
                        await conn.stop();
                    }
                    if (!disposed) {
                        setIsConnected(false);
                        reset();
                    }
                    return;
                }

                if (conn.state === HubConnectionState.Disconnected) {
                    await conn.start();
                }

                if (disposed) return;
                setIsConnected(conn.state === HubConnectionState.Connected);

                // NEMA invoke ovdje.
                // Backlog (unread) server šalje u OnConnectedAsync kao ReceiveNotifications([...]).
            } catch (err) {
                if (disposed) return;
                setIsConnected(false);
                console.log("[NotificationsHub] START FAILED", {
                    message: getErrorMessage(err),
                    state: conn.state,
                });
            }
        })();

        return () => {
            disposed = true;
            conn.off("ReceiveNotification", onReceiveNotification);
            conn.off("ReceiveNotifications", onReceiveNotifications);
            conn.off("UnreadCountChanged", onUnreadCountChanged);
        };
    }, [conn, jwt, push, upsertMany, reset]);

    return { isConnected };
}
