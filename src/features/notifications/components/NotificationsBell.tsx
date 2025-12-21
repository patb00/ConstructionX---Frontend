// features/notifications/components/NotificationsBell.tsx
import { useMemo, useState } from "react";
import {
    Badge,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNavigate } from "react-router-dom";

import { useNotificationsStore } from "../store/useNotificationsStore";
import { notificationsApi } from "../api/notificationsApi";
import type { NotificationDto } from "../../../signalR/notificationsHub/types";

function fmt(dt: string) {
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
}

export function NotificationsBell() {
    const navigate = useNavigate();

    const items = useNotificationsStore((s) => s.items);
    const unreadCount = useNotificationsStore((s) => s.unreadCount);
    const markReadLocal = useNotificationsStore((s) => s.markReadLocal);
    const markAllReadLocal = useNotificationsStore((s) => s.markAllReadLocal);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const latest = useMemo(() => items.slice(0, 10), [items]);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleClickItem = async (n: NotificationDto) => {
        handleClose();

        if (!n.isRead) markReadLocal(n.id);

        // trajno spremi read state u bazi
        try {
            if (!n.isRead) await notificationsApi.markRead(n.id);
        } catch (e) {
            // UI ostaje optimističan; po potrebi kasnije refetch liste
            console.log("[Notifications] markRead failed", e);
        }

        if (n.actionUrl) navigate(n.actionUrl);
    };

    const handleMarkAllRead = async () => {
        handleClose();

        markAllReadLocal();

        try {
            await notificationsApi.markAllRead();
        } catch (e) {
            console.log("[Notifications] markAllRead failed", e);
        }
    };

    return (
        <>
            <IconButton onClick={handleOpen} aria-label="notifications">
                <Badge badgeContent={unreadCount} color="error" max={99}>
                    <NotificationsNoneIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { width: 380, maxWidth: "92vw" } }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography fontWeight={700}>Notifications</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Unread: {unreadCount}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {latest.length === 0 && (
                    <MenuItem disabled>
                        <ListItemText primary="No notifications" />
                    </MenuItem>
                )}

                {latest.map((n) => (
                    <MenuItem
                        key={n.id}
                        onClick={() => void handleClickItem(n)}
                        sx={{ alignItems: "flex-start", py: 1.25 }}
                    >
                        <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
                            {!n.isRead ? (
                                <FiberManualRecordIcon sx={{ fontSize: 10 }} color="primary" />
                            ) : (
                                <FiberManualRecordIcon sx={{ fontSize: 10 }} color="disabled" />
                            )}
                        </ListItemIcon>

                        <ListItemText
                            primary={
                                <Typography variant="body2" fontWeight={n.isRead ? 500 : 800}>
                                    {n.title}
                                </Typography>
                            }
                            secondary={
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {n.message}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {fmt(n.createdDate)}
                                    </Typography>
                                </Box>
                            }
                        />
                    </MenuItem>
                ))}

                <Divider />

                <MenuItem onClick={() => void handleMarkAllRead()} disabled={unreadCount === 0}>
                    <ListItemIcon>
                        <DoneAllIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Mark all as read" />
                </MenuItem>
            </Menu>
        </>
    );
}
