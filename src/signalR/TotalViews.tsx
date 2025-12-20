// TotalViews.tsx
import { useUserHubViews } from "../signalR/hooks/useUserHubViews";

export function TotalViews() {
    const { totalViews, isConnected } = useUserHubViews();
    return (
        <div>
            Total views: <b>{totalViews}</b> {!isConnected && "(disconnected)"}
        </div>
    );
}
