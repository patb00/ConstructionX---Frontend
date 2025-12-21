// features/notifications/store/useNotificationsStore.ts
import { create } from "zustand";
import type { NotificationDto } from "../../../signalR/notificationsHub/types";

type State = {
    items: NotificationDto[];
    unreadCount: number;

    reset: () => void;
    upsertMany: (items: NotificationDto[]) => void;
    push: (n: NotificationDto) => void;
    markReadLocal: (id: number) => void;
    markAllReadLocal: () => void;
};

const byCreatedDesc = (a: NotificationDto, b: NotificationDto) =>
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();

export const useNotificationsStore = create<State>((set) => ({
    items: [],
    unreadCount: 0,

    reset: () => set({ items: [], unreadCount: 0 }),

    upsertMany: (incoming) =>
        set((s) => {
            const map = new Map<number, NotificationDto>();
            for (const n of s.items) map.set(n.id, n);
            for (const n of incoming) map.set(n.id, n);

            const items = Array.from(map.values()).sort(byCreatedDesc);
            const unreadCount = items.reduce((acc, n) => acc + (n.isRead ? 0 : 1), 0);
            return { items, unreadCount };
        }),

    push: (n) =>
        set((s) => {
            const exists = s.items.some((x) => x.id === n.id);
            const items = exists
                ? s.items.map((x) => (x.id === n.id ? n : x)).sort(byCreatedDesc)
                : [n, ...s.items].sort(byCreatedDesc);

            const unreadCount = items.reduce((acc, x) => acc + (x.isRead ? 0 : 1), 0);
            return { items, unreadCount };
        }),

    markReadLocal: (id) =>
        set((s) => {
            const items = s.items.map((n) => (n.id === id ? { ...n, isRead: true } : n));
            const unreadCount = items.reduce((acc, x) => acc + (x.isRead ? 0 : 1), 0);
            return { items, unreadCount };
        }),

    markAllReadLocal: () =>
        set((s) => {
            const items = s.items.map((n) => ({ ...n, isRead: true }));
            return { items, unreadCount: 0 };
        }),
}));
