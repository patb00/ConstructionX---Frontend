import { useMemo, useState, useCallback } from "react";
import { Box, Chip, Tooltip, CircularProgress } from "@mui/material";
import {
  GridActionsCellItem,
  type GridColDef,
  type GridActionsColDef,
  type GridActionsCellItemProps,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import type { User } from "..";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useActivateUser } from "../hooks/useActivateUser";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import UserRolesDialog from "./UserRolesDialog";
import { useCan, PermissionGate } from "../../../../lib/permissions";

type Props = {
  rows: User[];
  columns: GridColDef<User>[];
};

export default function UsersTable({ rows, columns }: Props) {
  const navigate = useNavigate();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const updateStatus = useActivateUser();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [rolesDialogUser, setRolesDialogUser] = useState<string | null>(null);

  const requestDelete = useCallback((u: User) => {
    setPendingUser(u);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteUser.isPending) return;
    setConfirmOpen(false);
    setPendingUser(null);
  }, [deleteUser.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingUser) return;
    deleteUser.mutate(pendingUser.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingUser(null);
      },
    });
  }, [deleteUser, pendingUser]);

  const toggleStatus = (u: User) =>
    updateStatus.mutate({ userId: u.id, activation: !u.isActive });

  const columnsWithActions = useMemo<GridColDef<User>[]>(() => {
    const base = columns.map((c) => {
      if (c.field === "isActive") {
        return {
          ...c,
          align: "center",
          headerAlign: "center",
          renderCell: (params) => (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Chip
                size="small"
                label={params.row.isActive ? "Active" : "Inactive"}
                color={params.row.isActive ? "success" : "default"}
                variant={params.row.isActive ? "filled" : "outlined"}
              />
            </Box>
          ),
        } as GridColDef<User>;
      }
      return c;
    });

    const canEdit = can({ permission: "Permission.Users.Update" });
    const canDelete = can({ permission: "Permission.Users.Delete" });
    const canToggle = can({ permission: "Permission.Users.Update" });
    const canSeeRoles =
      can({ permission: "Permission.UserRoles.Read" }) ||
      can({ permission: "Permission.UserRoles.Update" });

    if (!(canEdit || canDelete || canToggle || canSeeRoles)) return base;

    const actionsCol: GridActionsColDef<User> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 300,
      getActions: ({
        row,
      }): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const u = row;

        const isUpdating =
          updateUser.isPending && (updateUser.variables as any)?.id === u.id;
        const isToggling =
          updateStatus.isPending &&
          (updateStatus.variables as any)?.userId === u.id;
        const isDeleting =
          deleteUser.isPending && (deleteUser.variables as any) === u.id;
        const busy = isUpdating || isToggling || isDeleting;

        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canEdit) {
          items.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title="Uredi korisnika">
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label="Uredi"
              disabled={busy}
              onClick={() => navigate(`${u.id}/edit`)}
              showInMenu={false}
            />
          );
        }

        if (canDelete) {
          items.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title="Izbriši korisnika">
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label="Obriši"
              disabled={isDeleting}
              onClick={() => requestDelete(u)}
              showInMenu={false}
            />
          );
        }

        if (canToggle) {
          items.push(
            u.isActive ? (
              <GridActionsCellItem
                key="deactivate"
                icon={
                  <Tooltip title="Deaktiviraj korisnika">
                    {isToggling ? (
                      <CircularProgress size={16} />
                    ) : (
                      <BlockIcon fontSize="small" />
                    )}
                  </Tooltip>
                }
                label="Deaktiviraj"
                disabled={busy}
                onClick={() => toggleStatus(u)}
                showInMenu={false}
              />
            ) : (
              <GridActionsCellItem
                key="activate"
                icon={
                  <Tooltip title="Aktiviraj korisnika">
                    {isToggling ? (
                      <CircularProgress size={16} />
                    ) : (
                      <CheckIcon fontSize="small" />
                    )}
                  </Tooltip>
                }
                label="Aktiviraj"
                disabled={busy}
                onClick={() => toggleStatus(u)}
                showInMenu={false}
              />
            )
          );
        }

        if (canSeeRoles) {
          items.push(
            <GridActionsCellItem
              key="roles"
              icon={
                <Tooltip title="Uloge korisnika">
                  <SecurityIcon fontSize="small" color="primary" />
                </Tooltip>
              }
              label="Uloge"
              onClick={() => setRolesDialogUser(u.id)}
              showInMenu={false}
            />
          );
        }

        return items;
      },
    };

    return [...base, actionsCol];
  }, [
    columns,
    can,
    deleteUser.isPending,
    deleteUser.variables,
    updateUser.isPending,
    updateUser.variables,
    updateStatus.isPending,
    updateStatus.variables,
    navigate,
    requestDelete,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  return (
    <>
      <ReusableDataGrid<User>
        rows={rows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        pageSize={10}
        stickyRightField={hasActions ? "actions" : undefined}
      />

      <PermissionGate guard={{ permission: "Permission.Users.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title="Izbriši korisnika?"
          description={`Jeste li sigurni da želite izbrisati korisnika ?`}
          confirmText="Obriši"
          cancelText="Odustani"
          loading={deleteUser.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>

      {(rolesDialogUser && can({ permission: "Permission.UserRoles.Read" })) ||
      can({ permission: "Permission.UserRoles.Update" }) ? (
        <UserRolesDialog
          userId={rolesDialogUser as string}
          open
          onClose={() => setRolesDialogUser(null)}
        />
      ) : null}
    </>
  );
}
