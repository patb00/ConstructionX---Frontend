// signalR/userHub/useUserHubViews.ts
import { useEffect, useMemo, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { getUserHubConnection } from "./connection";
import { getSignalRJwt } from "../userHub/getSignalRJWT";
import type { ViewsState } from "../types";

/**
 * Pretvara unknown error u string za log.
 * (SignalR zna baciti razne oblike grešaka)
 */
function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

/**
 * React hook koji:
 * 1) uzme singleton HubConnection
 * 2) registrira event handlere (server->client)
 * 3) starta konekciju ako ima JWT i ako je disconnected
 * 4) pozove server metodu "IsPageLoaded" (client->server)
 * 5) drži lokalni state totalViews + isConnected
 *
 * Važno:
 * - Hook NE kreira novu vezu svaki put; veza je singleton iz connection.ts
 * - Hook se ponaša kao "subscriberi": montira se, zakači event, unmount -> off
 */
export function useUserHubViews() {
    // Lokalni state koji predstavlja zadnje primljene podatke sa servera.
    const [view, setView] = useState<ViewsState>({ totalViews: 0 });

    // Lokalni "status veze" za UI.
    const [isConnected, setIsConnected] = useState(false);

    // Base URL API-ja (npr. https://localhost:5001 ili https://api.tvojapp.com)
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

    /**
     * useMemo: uzmi istu konekciju za isti baseUrl.
     * U praksi: getUserHubConnection ionako vraća singleton,
     * ali memo drži stabilnu referencu u hooku.
     */
    const conn = useMemo(() => getUserHubConnection(baseUrl), [baseUrl]);

    useEffect(() => {
        /**
         * disposed služi da spriječi setState nakon unmounta.
         * To se događa kad async start/ invoke završi nakon što se komponenta već ugasila.
         */
        let disposed = false;

        /**
         * Server -> client event handler.
         * Server šalje event "UpdateTotalViews" sa payloadom number.
         * Mi mapiramo u state shape { totalViews: number }.
         */
        const onUpdateTotalViews = (v: number) => setView({ totalViews: v });

        // Registracija server eventa.
        conn.on("UpdateTotalViews", onUpdateTotalViews);

        /**
         * Lifecycle logovi konekcije:
         * - onclose: veza pukla ili stop() pozvan
         * - onreconnecting: SignalR ulazi u retry loop
         * - onreconnected: ponovno uspostavljena veza
         */
        conn.onclose((err) => {
            setIsConnected(false);
            console.log("[SignalR] CLOSED", { message: err?.message, state: conn.state });
        });

        conn.onreconnecting((err) => {
            setIsConnected(false);
            console.log("[SignalR] RECONNECTING", { message: err?.message, state: conn.state });
        });

        conn.onreconnected((connectionId) => {
            setIsConnected(true);
            console.log("[SignalR] RECONNECTED", { connectionId, state: conn.state });
        });

        /**
         * Start + invoke flow:
         * - prvo provjeri JWT (nema JWT => nema spajanja)
         * - startaj ako je Disconnected
         * - nakon uspješnog starta: postavi isConnected
         * - invoke "IsPageLoaded" da server zna da je stranica "aktivna"
         *
         * "IsPageLoaded" tipično radi:
         * - increment view count
         * - dodavanje usera u grupe
         * - slanje initial state-a (npr. trenutni totalViews)
         */
        (async () => {
            try {
                const jwt = getSignalRJwt();

                // Bez JWT-a ne spajamo se.
                // Time izbjegavaš 401 loop + nepotrebne WS pokušaje.
                if (!jwt) {
                    setIsConnected(false);
                    return;
                }

                // SignalR connection state machine:
                // Disconnected -> Connecting -> Connected
                if (conn.state === HubConnectionState.Disconnected) {
                    await conn.start();
                }

                if (disposed) return;

                // Po startu, state bi trebao biti Connected.
                setIsConnected(conn.state === HubConnectionState.Connected);

                // Client -> server: signal "page loaded"
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

        /**
         * Cleanup:
         * - označi disposed
         * - odregistriraj event handler
         *
         * Napomena:
         * - conn.onclose/onreconnecting/onreconnected ostaju registrirani.
         *   Ako ovaj hook mounta/umounta više puta, možeš dobiti duple logove.
         *   Rješenje je: ili registrirati i njih s conn.off u cleanupu,
         *   ili registrirati te lifecycle handlere jednom u connection.ts nakon build().
         */
        return () => {
            disposed = true;
            conn.off("UpdateTotalViews", onUpdateTotalViews);
        };
    }, [conn]);

    // Vraća state u formatu pogodnom za UI.
    return { view, totalViews: view.totalViews, isConnected };
}
