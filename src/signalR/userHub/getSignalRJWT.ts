// signalR/userHub/getSignalRJwt.ts
import { useAuthStore } from "../../features/auth/store/useAuthStore";

const stripBearer = (raw: string) => (raw.startsWith("Bearer ") ? raw.slice(7) : raw);

export function getSignalRJwt(): string {
    const jwt = useAuthStore.getState().jwt ?? "";
    return stripBearer(jwt.trim());
}
