// signalR/userHub/connection.ts
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";
import { getSignalRJwt } from "../userHub/getSignalRJWT";

// Singleton konekcija za UserHub.
// Cilj: jedna jedina SignalR veza po browser tabu (ne po komponenti).
let conn: HubConnection | null = null;

/**
 * Vraća (i po potrebi kreira) HubConnection prema `/hubs/user`.
 *
 * Zašto singleton?
 * - Ako svaki React hook/komponenta gradi svoju konekciju, dobit ćeš:
 *   - više WS veza (opterećenje servera i klijenta)
 *   - duple event handlere (isti event obrađuješ više puta)
 *   - race condition oko start/stop.
 */
export function getUserHubConnection(baseUrl: string): HubConnection {
    // Ako je već kreirana, vraćamo istu instancu.
    if (conn) return conn;

    // Kreiranje konekcije (ali NE starta se ovdje).
    // Start radi hook, kad ima JWT i kad komponenta mounta.
    conn = new HubConnectionBuilder()
        .withUrl(`${baseUrl}/hubs/user`, {
            // SignalR će JWT staviti u query param `access_token` pri WS connectu.
            // Ova funkcija se može pozvati više puta (npr. kod reconnecta),
            // pa uvijek vraća "trenutni" JWT iz store-a.
            accessTokenFactory: () => getSignalRJwt(),

            // Forsira WebSockets.
            // Ako WS ne radi u tvojem okruženju (proxy, IIS config, LB),
            // veza se neće uspostaviti jer nema fallbacka.
            transport: HttpTransportType.WebSockets,

            // Preskače negotiate endpoint.
            // Važi samo kad forsiraš WS; inače negotiate treba za fallback transport.
            skipNegotiation: true,
        })
        // Automatski reconnect (zadani retry policy SignalR-a).
        .withAutomaticReconnect()

        // Client-side logovi SignalR-a (pomaže debug).
        .configureLogging(LogLevel.Information)
        .build();

    return conn;
}

/**
 * Zaustavlja konekciju i resetira singleton.
 *
 * Kada koristiti:
 * - logout (da se prekine veza i obriše JWT kontekst)
 * - hard teardown featurea (npr. prelazak u dio aplikacije gdje ne želiš hub)
 *
 * Napomena:
 * - stop() prekida WS i okida onclose event.
 * - reset conn=null znači da idući getUserHubConnection() gradi novu vezu.
 */
export async function stopUserHubConnection(): Promise<void> {
    if (!conn) return;

    const current = conn;
    conn = null;

    await current.stop();
}
