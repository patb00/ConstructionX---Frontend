// signalR/TotalViews.tsx
import { useUserHubViews } from "./userHub/useUserHubViews";

/**
 * UI komponenta koja prikazuje total views.
 *
 * Ovdje nema SignalR logike.
 * Ovdje samo čita state iz hooka i rendera vrijednost.
 *
 * Zbog singleton konekcije:
 * - Ako ovu komponentu renderaš na više mjesta, hook će se mountati više puta,
 *   ali veza je i dalje jedna; problem može biti dupli handleri ako cleanup nije potpun.
 */
export function TotalViews() {
    const { totalViews, isConnected } = useUserHubViews();

    return (
        <div>
            Total views: <b>{totalViews}</b> {!isConnected && "(disconnected)"}
        </div>
    );
}
