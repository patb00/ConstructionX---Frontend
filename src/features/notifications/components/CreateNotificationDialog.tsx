import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Stack,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { AssignTaskDialog } from "../../../components/ui/assign-dialog/AssignTaskDialog";
import { useUsers } from "../../administration/users/hooks/useUsers";
import { useCreateNotification } from "../hooks/useCreateNotification";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateNotificationDialog({ open, onClose }: Props) {
  const { t } = useTranslation();
  const { usersRows, isLoading: usersLoading } = useUsers();
  const createMutation = useCreateNotification();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filter users if needed? For now show all.
  const users = useMemo(() => usersRows, [usersRows]);

  const handleToggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = () => {
    createMutation.mutate(
      {
        userIds: selectedUserIds,
        title,
        message,
        actionUrl: actionUrl || undefined,
        entityType: entityType || undefined,
        entityId: entityId || undefined,
        // createdByName is optional, backend probably infers it from token
      },
      {
        onSuccess: () => {
          onClose();
          // Reset form?
          setTitle("");
          setMessage("");
          setActionUrl("");
          setEntityType("");
          setEntityId("");
          setSelectedUserIds([]);
        },
      }
    );
  };

  const isValid = title && message && selectedUserIds.length > 0;

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
      title={t("notifications.create.title", "Send Notification")}
      headerIcon={<NotificationsActiveOutlinedIcon sx={{ fontSize: 18 }} />}
      submitText={t("common.send", "Send")}
      cancelText={t("common.cancel", "Cancel")}
      onSubmit={handleSubmit}
      submitting={createMutation.isPending}
      submitDisabled={!isValid}
      formLoading={usersLoading}
      previewTitle={t("notifications.create.preview", "Details")}
      previewFields={[
        { label: t("notifications.create.titleLabel", "Title"), value: title || "-" },
        { label: t("notifications.create.recipients", "Recipients"), value: selectedUserIds.length },
      ]}
    >
      <Stack spacing={2}>
        <TextField
          label={t("notifications.create.titleLabel", "Title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          size="small"
        />
        <TextField
          label={t("notifications.create.messageLabel", "Message")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          rows={3}
          required
          size="small"
        />

        <Stack direction="row" spacing={2}>
          <TextField
            label={t("notifications.create.url", "Action URL")}
            value={actionUrl}
            onChange={(e) => setActionUrl(e.target.value)}
            fullWidth
            size="small"
          />
        </Stack>
        <Stack direction="row" spacing={2}>
           <TextField
            label={t("notifications.create.entityType", "Entity Type")}
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label={t("notifications.create.entityId", "Entity ID")}
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            fullWidth
            size="small"
          />
        </Stack>

        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2, maxHeight: 300, overflowY: "auto" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2">{t("notifications.create.selectUsers", "Select Users")}</Typography>
                <FormControlLabel
                    control={<Checkbox checked={selectAll} onChange={handleSelectAll} size="small" />}
                    label={t("common.selectAll", "Select All")}
                />
            </Stack>
            <Grid container spacing={1}>
                {users.map((u) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={u.id}>
                         <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedUserIds.includes(u.id)}
                                    onChange={() => handleToggleUser(u.id)}
                                    size="small"
                                />
                            }
                            label={
                                <Typography variant="body2" noWrap title={u.userName}>
                                    {u.userName}
                                </Typography>
                            }
                            sx={{ width: "100%", mr: 0 }}
                         />
                    </Grid>
                ))}
            </Grid>
        </Box>
      </Stack>
    </AssignTaskDialog>
  );
}
