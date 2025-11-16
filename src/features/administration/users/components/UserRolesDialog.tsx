import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import { useUserRoles } from "../hooks/useUserRoles";
import { useUpdateRoles } from "../hooks/useUpdateRoles";
import type { UserRoleAssignment, UserRolesResponse } from "..";
import { useTranslation } from "react-i18next";

type Props = { userId: string; open: boolean; onClose: () => void };

export default function UserRolesDialog({ userId, open, onClose }: Props) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useUserRoles(userId);
  const updateRoles = useUpdateRoles();

  const rolesList: UserRoleAssignment[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as UserRoleAssignment[];
    return (data as UserRolesResponse).userRoles ?? [];
  }, [data]);

  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    setSelected(rolesList.filter((r) => r.isAssigned).map((r) => r.roleId));
  }, [rolesList, userId]);

  const toggleRole = (roleId: string) => {
    setSelected((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = () => {
    if (!rolesList.length || updateRoles.isPending) return;
    updateRoles.mutate(
      {
        userId,
        payload: {
          userRoles: rolesList.map((r) => ({
            ...r,
            isAssigned: selected.includes(r.roleId),
          })),
        },
      },
      { onSuccess: onClose }
    );
  };

  const handleDialogClose = (
    _event: object,
    _reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (updateRoles.isPending) return;
    onClose();
  };

  const handleExplicitClose = () => {
    if (updateRoles.isPending) return;
    onClose();
  };

  const title = t("users.rolesDialog.title");

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          position: "relative",
          p: 2.5,
          pt: 2.25,
          pb: 2.5,
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 0,
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {title}
        </DialogTitle>

        <IconButton
          onClick={handleExplicitClose}
          disabled={updateRoles.isPending}
          sx={{
            width: 32,
            height: 32,
            borderRadius: "999px",
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: "#EFF6FF",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 16, color: "#111827" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, mb: 2 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ py: 1 }}>
            {t("users.rolesDialog.error")}
          </Typography>
        ) : rolesList.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 1 }}>
            {t("users.rolesDialog.empty")}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {rolesList.map((r) => (
              <FormControlLabel
                key={r.roleId}
                control={
                  <Checkbox
                    checked={selected.includes(r.roleId)}
                    onChange={() => toggleRole(r.roleId)}
                    disabled={updateRoles.isPending}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {r.name}
                    </Typography>
                    {r.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.25 }}
                      >
                        {r.description}
                      </Typography>
                    )}
                  </Box>
                }
              />
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 0,
          mt: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleExplicitClose}
          disabled={updateRoles.isPending}
          size="small"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 500,
            px: 2.5,
            borderColor: "#E5E7EB",
            color: "#111827",
            backgroundColor: "#ffffff",
            "&:hover": {
              backgroundColor: "#F9FAFB",
              borderColor: "#D1D5DB",
            },
          }}
        >
          {t("users.rolesDialog.cancel")}
        </Button>

        <Button
          onClick={handleSave}
          size="small"
          variant="contained"
          disabled={updateRoles.isPending || rolesList.length === 0}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
          }}
        >
          {updateRoles.isPending
            ? t("users.rolesDialog.saving")
            : t("users.rolesDialog.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
