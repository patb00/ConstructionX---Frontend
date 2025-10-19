import { useMemo, useState, useCallback } from "react";
import { Box, Chip, Tooltip, CircularProgress } from "@mui/material";
import {
  GridActionsCellItem,
  type GridColDef,
  type GridActionsColDef,
  type GridActionsCellItemProps,
  type GridRowParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import type { User } from "..";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useActivateUser } from "../hooks/useActivateUser";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import UserRolesDialog from "./UserRolesDialog";
import { PermissionGate, useCan } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";

export default function UsersTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { usersColumns, usersRows, error, isLoading } = useUsers();
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
    const base = usersColumns.map((c) => {
      if (c.field === "firstName" && !c.headerName) {
        return {
          ...c,
          headerName: t("users.table.firstName"),
        } as GridColDef<User>;
      }
      if (c.field === "lastName" && !c.headerName) {
        return {
          ...c,
          headerName: t("users.table.lastName"),
        } as GridColDef<User>;
      }
      if (c.field === "email" && !c.headerName) {
        return { ...c, headerName: t("users.table.email") } as GridColDef<User>;
      }
      if (c.field === "phoneNumber" && !c.headerName) {
        return {
          ...c,
          headerName: t("users.table.phoneNumber"),
        } as GridColDef<User>;
      }
      if (c.field === "isActive") {
        return {
          ...c,
          headerName: c.headerName ?? t("users.table.status"),
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
                label={
                  params.row.isActive
                    ? t("users.table.statusActive")
                    : t("users.table.statusInactive")
                }
                color={params.row.isActive ? "success" : "default"}
                variant={params.row.isActive ? "filled" : "outlined"}
              />
            </Box>
          ),
        } as GridColDef<User>;
      }
      return c;
    });

    if (base.some((c) => c.field === "actions")) return base;

    // permissions
    const canEdit = can({ permission: "Permission.Users.Update" });
    const canDelete = can({ permission: "Permission.Users.Delete" });
    const canToggle = can({ permission: "Permission.Users.Update" });
    const canManageRoles = can({ permission: "Permission.UserRoles.Update" });

    if (!(canEdit || canDelete || canToggle || canManageRoles)) return base;

    const actionsCol: GridActionsColDef<User> = {
      field: "actions",
      type: "actions",
      headerName: t("users.table.actions"),
      width: 300,
      getActions: (
        params: GridRowParams<User>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const u = params.row;
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
                <Tooltip title={t("users.table.edit")}>
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label={t("users.table.edit")}
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
                <Tooltip title={t("users.table.delete")}>
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label={t("users.table.delete")}
              disabled={isDeleting}
              onClick={() => requestDelete(u)}
              showInMenu={false}
            />
          );
        }

        if (canToggle) {
          if (u.isActive) {
            items.push(
              <GridActionsCellItem
                key="deactivate"
                icon={
                  <Tooltip title={t("users.table.deactivate")}>
                    {isToggling ? (
                      <CircularProgress size={16} />
                    ) : (
                      <BlockIcon fontSize="small" />
                    )}
                  </Tooltip>
                }
                label={t("users.table.deactivate")}
                disabled={busy}
                onClick={() => toggleStatus(u)}
                showInMenu={false}
              />
            );
          } else {
            items.push(
              <GridActionsCellItem
                key="activate"
                icon={
                  <Tooltip title={t("users.table.activate")}>
                    {isToggling ? (
                      <CircularProgress size={16} />
                    ) : (
                      <CheckIcon fontSize="small" />
                    )}
                  </Tooltip>
                }
                label={t("users.table.activate")}
                disabled={busy}
                onClick={() => toggleStatus(u)}
                showInMenu={false}
              />
            );
          }
        }

        if (canManageRoles) {
          items.push(
            <GridActionsCellItem
              key="roles"
              icon={
                <Tooltip title={t("users.table.roles")}>
                  <SecurityIcon fontSize="small" color="primary" />
                </Tooltip>
              }
              label={t("users.table.roles")}
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
    usersColumns,
    deleteUser.isPending,
    deleteUser.variables,
    updateUser.isPending,
    updateUser.variables,
    updateStatus.isPending,
    updateStatus.variables,
    navigate,
    can,
    t,
  ]);

  if (error) return <div>{t("users.list.error")}</div>;
  console.log("usersColumns", usersColumns);
  return (
    <>
      <ReusableDataGrid<User>
        rows={usersRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        pageSize={10}
        stickyRightField="actions"
        loading={!!isLoading}
      />

      <PermissionGate guard={{ permission: "Permission.Users.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("users.delete.title")}
          description={t("users.delete.description")}
          confirmText={t("users.delete.confirm")}
          cancelText={t("users.delete.cancel")}
          loading={deleteUser.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>

      {rolesDialogUser && (
        <PermissionGate guard={{ permission: "Permission.UserRoles.Update" }}>
          <UserRolesDialog
            userId={rolesDialogUser}
            open
            onClose={() => setRolesDialogUser(null)}
          />
        </PermissionGate>
      )}
    </>
  );
}
