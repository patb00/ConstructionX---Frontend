// useUserHubViews.ts
import { useEffect, useRef, useState } from "react";
import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    HttpTransportType,
} from "@microsoft/signalr";
import type { View } from "../types.ts";

// prilagodi key ako token spremaš pod drugim imenom
const getAccessToken = () => localStorage.getItem("access_token") ?? "";

// eslint-safe: ne koristi any
function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

export function useUserHubViews() {
    const [view, setView] = useState<View>({ totalViews: 0 });
    const [isConnected, setIsConnected] = useState(false);

    // opcionalno: ako želiš kasnije ručno stop/start
    const connRef = useRef<HubConnection | null>(null);

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

        const conn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/hubs/user`, {
                // JWT ide kao ?access_token=... (SignalR standard)
                accessTokenFactory: getAccessToken,

                // optional: forsira WS (ako želiš fallback, makni ovaj transport)
                transport: HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        connRef.current = conn;

        const onUpdateTotalViews = (v: number) => {
            setView({ totalViews: v });
        };

        conn.on("UpdateTotalViews", onUpdateTotalViews);

        conn.onclose((err) => {
            console.log("[SignalR] CLOSED", {
                hasError: !!err,
                message: err?.message,
                state: conn.state,
            });
            setIsConnected(false);
        });

        conn.onreconnecting((err) => {
            console.log("[SignalR] RECONNECTING", {
                hasError: !!err,
                message: err?.message,
                state: conn.state,
            });
            setIsConnected(false);
        });

        conn.onreconnected((connectionId) => {
            console.log("[SignalR] RECONNECTED", {
                connectionId,
                state: conn.state,
            });
            setIsConnected(true);
        });

        let disposed = false;

        (async () => {
            try {
                await conn.start();
                if (disposed) return;

                console.log("[SignalR] CONNECTED", {
                    connectionId: conn.connectionId,
                    state:
                        conn.state === HubConnectionState.Connected
                            ? "Connected"
                            : conn.state,
                });

                setIsConnected(true);

                // radi točno ono što tvoj hub trenutno radi (TotalViews++)
                await conn.invoke("IsPageLoaded");
            } catch (err: unknown) {
                if (disposed) return;

                console.log("[SignalR] START FAILED", {
                    message: getErrorMessage(err),
                    state: conn.state,
                });

                setIsConnected(false);
            }
        })();

        return () => {
            disposed = true;

            conn.off("UpdateTotalViews", onUpdateTotalViews);

            console.log("[SignalR] STOP (cleanup)", { stateBeforeStop: conn.state });
            void conn.stop();

            connRef.current = null;
        };
    }, []);

    return { view, totalViews: view.totalViews, isConnected };
}
