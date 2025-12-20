// signalR/userHub/types.ts
export type ViewsState = {
    totalViews: number;
};

// server -> client event payloads
export type UpdateTotalViewsPayload = number;

// (opcionalno) “shape” eventova radi čitljivosti
export type UserHubServerToClient = {
    UpdateTotalViews: (views: UpdateTotalViewsPayload) => void;
};

export type UserHubClientToServer = {
    IsPageLoaded: () => Promise<void>;
};
