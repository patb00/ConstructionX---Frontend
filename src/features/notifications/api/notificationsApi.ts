// features/notifications/api/notificationsApi.ts
import { useAuthStore } from "../../auth/store/useAuthStore";

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

function authHeader() {
    const jwt = useAuthStore.getState().jwt;
    return jwt ? { Authorization: jwt } : {};
}

export const notificationsApi = {
    async getMyUnread(take = 10) {
        const res = await fetch(`${baseUrl}/api/notifications/my-unread?take=${take}`, {
            headers: { ...authHeader() },
        });
        if (!res.ok) throw new Error(`getMyUnread failed: ${res.status}`);
        return res.json();
    },

    async markRead(id: number): Promise<void> {
        const res = await fetch(`${baseUrl}/api/notifications/${id}/read`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeader() },
        });
        if (!res.ok) throw new Error(`markRead failed: ${res.status}`);
    },

    async markAllRead(): Promise<void> {
        const res = await fetch(`${baseUrl}/api/notifications/read-all`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeader() },
        });
        if (!res.ok) throw new Error(`markAllRead failed: ${res.status}`);
    },
};
