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
} from "@mui/material";
import * as React from "react";
import { useUserRoles } from "../hooks/useUserRoles";
import { useUpdateRoles } from "../hooks/useUpdateRoles";
import type { UserRoleAssignment, UserRolesResponse } from "..";

type Props = { userId: string; open: boolean; onClose: () => void };

export default function UserRolesDialog({ userId, open, onClose }: Props) {
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
    if (!rolesList.length) return;
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          border: (t) => `1px solid ${t.palette.primary.main}`,
        },
      }}
    >
      <DialogTitle>Upravljanje ulogama</DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ py: 1 }}>
            Neuspjelo učitavanje uloga.
          </Typography>
        ) : rolesList.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 1 }}>
            Nema dostupnih uloga.
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

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          disabled={updateRoles.isPending}
          variant="outlined"
          sx={{
            color: (t) => t.palette.grey[700],
            borderColor: (t) => t.palette.grey[400],
            "&:hover": {
              backgroundColor: (t) => t.palette.grey[100],
              borderColor: (t) => t.palette.grey[500],
            },
          }}
        >
          Odustani
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          disabled={updateRoles.isPending || rolesList.length === 0}
        >
          {updateRoles.isPending ? "Spremanje..." : "Spremi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
