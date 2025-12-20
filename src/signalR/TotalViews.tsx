// signalR/TotalViews.tsx
import { useUserHubViews } from "./userHub/useUserHubViews";

export function TotalViews() {
    const { totalViews, isConnected } = useUserHubViews();

    return (
        <div>
            Total views: <b>{totalViews}</b> {!isConnected && "(disconnected)"}
        </div>
    );
}
