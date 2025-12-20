// signalR/userHub/useUserHubViews.ts
import { useEffect, useMemo, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { getUserHubConnection } from "../connection";
import type { ViewsState } from "../types";

const getAccessToken = () => localStorage.getItem("access_token") ?? "";

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
    const [view, setView] = useState<ViewsState>({ totalViews: 0 });
    const [isConnected, setIsConnected] = useState(false);

    const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

    const conn = useMemo(
        () =>
            getUserHubConnection({
                baseUrl,
                getAccessToken,
            }),
        [baseUrl]
    );

    useEffect(() => {
        let disposed = false;

        const onUpdateTotalViews = (v: number) => setView({ totalViews: v });

        conn.on("UpdateTotalViews", onUpdateTotalViews);

        conn.onclose((err) => {
            setIsConnected(false);
            console.log("[SignalR] CLOSED", {
                message: err?.message,
                state: conn.state,
            });
        });

        conn.onreconnecting((err) => {
            setIsConnected(false);
            console.log("[SignalR] RECONNECTING", {
                message: err?.message,
                state: conn.state,
            });
        });

        conn.onreconnected((connectionId) => {
            setIsConnected(true);
            console.log("[SignalR] RECONNECTED", {
                connectionId,
                state: conn.state,
            });
        });

        (async () => {
            try {
                if (conn.state === HubConnectionState.Disconnected) {
                    await conn.start();
                }

                if (disposed) return;

                setIsConnected(conn.state === HubConnectionState.Connected);

                await conn.invoke("IsPageLoaded");
            } catch (err) {
                if (disposed) return;

                setIsConnected(false);
                console.log("[SignalR] START/INVOKE FAILED", {
                    message: getErrorMessage(err),
                    state: conn.state,
                });
            }
        })();

        return () => {
            disposed = true;
            conn.off("UpdateTotalViews", onUpdateTotalViews);
        };
    }, [conn]);

    return { view, totalViews: view.totalViews, isConnected };
}
