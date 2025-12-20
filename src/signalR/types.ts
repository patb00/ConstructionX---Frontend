// signalR/userHub/types.ts

/**
 * Lokalni shape state-a koji UI koristi.
 * (Tvoj UI drži { totalViews } kao objekt da se može lako proširiti kasnije.)
 */
export type ViewsState = {
    totalViews: number;
};

/**
 * Server -> client event payload.
 * U ovom slučaju server šalje samo broj.
 */
export type UpdateTotalViewsPayload = number;

/**
 * Tipizirana mapa server->client eventova.
 * Korisno ako želiš kasnije napraviti typed wrapper oko conn.on / conn.off.
 */
export type UserHubServerToClient = {
    UpdateTotalViews: (views: UpdateTotalViewsPayload) => void;
};

/**
 * Tipizirana mapa client->server metoda.
 * Dokumentira koje metode client smije zvati.
 */
export type UserHubClientToServer = {
    IsPageLoaded: () => Promise<void>;
};
