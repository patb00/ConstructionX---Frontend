// signalR/userHub/getSignalRJwt.ts
import { useAuthStore } from "../../features/auth/store/useAuthStore";

/**
 * SignalR accessTokenFactory mora vratiti "goli" JWT (bez "Bearer " prefiksa),
 * jer SignalR sam radi `?access_token=...` i server očekuje token string.
 */
const stripBearer = (raw: string) =>
    raw.startsWith("Bearer ") ? raw.slice(7) : raw;

/**
 * Dohvaća JWT iz auth store-a (bez React hooka).
 *
 * Zašto getState()?
 * - accessTokenFactory se poziva izvan React rendera/effecta.
 * - getState() je sync i radi u bilo kojem kontekstu.
 *
 * Povrat:
 * - prazan string ako nema JWT-a (što hook tretira kao "ne spajaj se").
 */
export function getSignalRJwt(): string {
    const jwt = useAuthStore.getState().jwt ?? "";
    return stripBearer(jwt.trim());
}
