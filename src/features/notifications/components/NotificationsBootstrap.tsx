import { useEffect, useMemo } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { useSnackbar } from "notistack";

import { useAuthStore } from "../../auth/store/useAuthStore";
import { getNotificationsHubConnection, stopNotificationsHubConnection } from "../../../signalR/notificationsHub/connection";
import { useNotificationsStore } from "../store/useNotificationsStore";
import type { NotificationDto } from "../../../signalR/notificationsHub/types";

function stripBearer(raw: string) {
    return raw.startsWith("Bearer ") ? raw.slice(7) : raw;
}

export function NotificationsBootstrap() {
    const { enqueueSnackbar } = useSnackbar();

    const jwt = useAuthStore((s) => s.jwt);
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

    const conn = useMemo(() => getNotificationsHubConnection(baseUrl), [baseUrl]);

    const upsertMany = useNotificationsStore((s) => s.upsertMany);
    const push = useNotificationsStore((s) => s.push);
    const reset = useNotificationsStore((s) => s.reset);

    useEffect(() => {
        let disposed = false;

        const onReceiveNotification = (n: NotificationDto) => {
            push(n);
            const text = n.title ? `${n.title}: ${n.message}` : n.message;
            enqueueSnackbar(text, { variant: "info" });
            console.log("[NotificationsHub] ReceiveNotification", n);
        };

        const onReceiveNotifications = (items: NotificationDto[]) => {
            upsertMany(items);
            console.log("[NotificationsHub] ReceiveNotifications(backlog)", items);
        };

        conn.on("ReceiveNotification", onReceiveNotification);
        conn.on("ReceiveNotifications", onReceiveNotifications);

        conn.onclose((err) => console.log("[NotificationsHub] closed", err));
        conn.onreconnecting((err) => console.log("[NotificationsHub] reconnecting", err));
        conn.onreconnected((id) => console.log("[NotificationsHub] reconnected", id));

        (async () => {
            try {
                if (!jwt) {
                    if (conn.state !== HubConnectionState.Disconnected) await conn.stop();
                    if (!disposed) reset();
                    return;
                }

                // token mora biti bez "Bearer "
                const token = stripBearer(jwt);
                if (!token) return;

                if (conn.state === HubConnectionState.Disconnected) {
                    await conn.start();
                    console.log("[NotificationsHub] connected", conn.connectionId);
                }
            } catch (e) {
                console.log("[NotificationsHub] START FAILED", e);
            }
        })();

        return () => {
            disposed = true;
            conn.off("ReceiveNotification", onReceiveNotification);
            conn.off("ReceiveNotifications", onReceiveNotifications);
        };
    }, [conn, jwt, enqueueSnackbar, push, upsertMany, reset]);

    // opcionalno: na unmount stop
    useEffect(() => {
        return () => {
            void stopNotificationsHubConnection();
        };
    }, []);

    return null;
}
