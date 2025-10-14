import { useMemo, useState, useCallback } from "react";
import { Box, Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  type GridColDef,
  type GridActionsColDef,
  type GridActionsCellItemProps,
  type GridRowParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useDeleteRole } from "../hooks/useDeleteRole";
import { useRoles } from "../hooks/useRoles";
import type { Role } from "..";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import { PermissionGate, useCan } from "../../../../lib/permissions";

export default function RolesTable() {
  const navigate = useNavigate();
  const { rolesRows, rolesColumns, error, isLoading } = useRoles();
  const deleteRole = useDeleteRole();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  const requestDelete = useCallback((r: Role) => {
    setPendingRole(r);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteRole.isPending) return;
    setConfirmOpen(false);
    setPendingRole(null);
  }, [deleteRole.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRole) return;
    deleteRole.mutate(pendingRole.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRole(null);
      },
    });
  }, [deleteRole, pendingRole]);

  const columnsWithActions = useMemo<GridColDef<Role>[]>(() => {
    const base = rolesColumns.map((c) => {
      if (c.field === "name" || c.field === "description") {
        return {
          ...c,
          renderCell: (params) => (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>{(params.value as string) ?? ""}</span>
            </Box>
          ),
        } as GridColDef<Role>;
      }
      return c;
    });

    const canEdit = can({ permission: "Permission.Roles.Update" });
    const canDelete = can({ permission: "Permission.Roles.Delete" });
    const canManageClaims =
      can({ permission: "Permission.RoleClaims.Update" }) ||
      can({ permission: "Permission.RoleClaims.Read" });

    // if user has no access to any actions
    if (!(canEdit || canDelete || canManageClaims)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridActionsColDef<Role> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 200,
      getActions: (
        params: GridRowParams<Role>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const row = params.row;
        const busy = deleteRole.isPending;
        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canEdit) {
          items.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title="Uredi ulogu">
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label="Uredi ulogu"
              disabled={busy}
              onClick={() => navigate(`${row.id}/edit`)}
              showInMenu={false}
            />
          );
        }

        if (canDelete) {
          items.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title="Izbriši ulogu">
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label="Obriši"
              disabled={busy}
              onClick={() => requestDelete(row)}
              showInMenu={false}
            />
          );
        }

        if (canManageClaims) {
          items.push(
            <GridActionsCellItem
              key="permissions"
              icon={
                <Tooltip title="Dozvole (Permissions)">
                  <SecurityIcon fontSize="small" color="primary" />
                </Tooltip>
              }
              label="Permissions"
              onClick={() =>
                navigate(`/app/administration/roles/${row.id}/permissions`)
              }
              showInMenu={false}
            />
          );
        }

        return items;
      },
    };

    return [...base, actionsCol];
  }, [rolesColumns, can, deleteRole.isPending, navigate, requestDelete]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>Uloge.</div>;

  return (
    <>
      <ReusableDataGrid<Role>
        rows={rolesRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        stickyRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
      />

      <PermissionGate guard={{ permission: "Permission.Roles.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title="Obriši ulogu?"
          description="Jeste li sigurni da želite obrisati ulogu?"
          confirmText="Obriši"
          cancelText="Odustani"
          loading={deleteRole.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
