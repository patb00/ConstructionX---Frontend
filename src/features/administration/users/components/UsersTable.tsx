import { useMemo, useState, useCallback } from "react";
import { Box, Chip } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../../components/ui/datagrid/GridDetailPanel";
import type { User } from "..";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useActivateUser } from "../hooks/useActivateUser";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import UserRolesDialog from "./UserRolesDialog";
import { PermissionGate, useCan } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";
import { RowActions } from "../../../../components/ui/datagrid/RowActions";

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
          renderCell: (params) => {
            const isActive = params.row.isActive;

            return (
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
                    isActive
                      ? t("users.table.statusActive")
                      : t("users.table.statusInactive")
                  }
                  color={isActive ? "success" : "error"}
                  variant="filled"
                  sx={{
                    color: !isActive ? "white" : undefined,
                  }}
                />
              </Box>
            );
          },
        } as GridColDef<User>;
      }

      return c;
    });

    if (base.some((c) => c.field === "actions")) return base;

    const canEdit = can({ permission: "Permission.Users.Update" });
    const canDelete = can({ permission: "Permission.Users.Delete" });
    const canToggle = can({ permission: "Permission.Users.Update" });
    const canManageRoles = can({ permission: "Permission.UserRoles.Update" });

    if (!(canEdit || canDelete || canToggle || canManageRoles)) return base;

    const actionsCol: GridColDef<User> = {
      field: "actions",
      headerName: t("users.table.actions"),
      width: 300,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const u = params.row;

        const isUpdating =
          updateUser.isPending && (updateUser.variables as any)?.id === u.id;
        const isToggling =
          updateStatus.isPending &&
          (updateStatus.variables as any)?.userId === u.id;
        const isDeleting =
          deleteUser.isPending && (deleteUser.variables as any) === u.id;

        const busy = isUpdating || isToggling || isDeleting;

        return (
          <RowActions
            color="#F1B103"
            disabled={busy}
            onEdit={
              canEdit
                ? () => {
                    navigate(`${u.id}/edit`);
                  }
                : undefined
            }
            onDelete={canDelete ? () => requestDelete(u) : undefined}
            onToggleActive={canToggle ? () => toggleStatus(u) : undefined}
            isActive={u.isActive}
            toggleLoading={isToggling}
            onManageRoles={
              canManageRoles ? () => setRolesDialogUser(u.id) : undefined
            }
            labels={{
              edit: t("users.table.edit"),
              delete: t("users.table.delete"),
              activate: t("users.table.activate"),
              deactivate: t("users.table.deactivate"),
              roles: t("users.table.roles"),
            }}
          />
        );
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

  const renderDetailPanel = useCallback(
    (params: GridRowParams<User>) => {
      return (
        <GridDetailPanel<User>
          row={params.row}
          columns={usersColumns as GridColDef<User>[]}
        />
      );
    },
    [usersColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<User>) => 220,
    []
  );

  if (error) return <div>{t("users.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<User>
        mobilePrimaryField="userName"
        storageKey="users"
        rows={usersRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        pageSize={10}
        pinnedRightField="actions"
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
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
