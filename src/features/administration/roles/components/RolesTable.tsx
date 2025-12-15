import { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useDeleteRole } from "../hooks/useDeleteRole";
import { useRoles } from "../hooks/useRoles";
import type { Role } from "..";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import { PermissionGate, useCan } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";
import { RowActions } from "../../../../components/ui/datagrid/RowActions";
import { GridDetailPanel } from "../../../../components/ui/datagrid/GridDetailPanel";

export default function RolesTable() {
  const { t } = useTranslation();
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
      if (c.field === "name") {
        return {
          ...c,
          headerName: c.headerName ?? t("roles.table.name"),
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
      if (c.field === "description") {
        return {
          ...c,
          headerName: c.headerName ?? t("roles.table.description"),
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

    if (!(canEdit || canDelete || canManageClaims)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Role> = {
      field: "actions",
      headerName: t("roles.actions"),
      width: 220,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const busy = deleteRole.isPending;

        return (
          <RowActions
            color="#F1B103"
            disabled={busy}
            onEdit={canEdit ? () => navigate(`${row.id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
            onManageRoles={
              canManageClaims
                ? () =>
                    navigate(`/app/administration/roles/${row.id}/permissions`)
                : undefined
            }
            labels={{
              edit: t("roles.table.edit"),
              delete: t("roles.table.delete"),
              roles: t("roles.table.permissions"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [rolesColumns, can, deleteRole.isPending, navigate, requestDelete, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<Role>) => {
      return (
        <GridDetailPanel<Role>
          row={params.row}
          columns={rolesColumns as GridColDef<Role>[]}
        />
      );
    },
    [rolesColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<Role>) => 200,
    []
  );

  if (error) return <div>{t("roles.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<Role>
        storageKey="roles"
        rows={rolesRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
      />

      <PermissionGate guard={{ permission: "Permission.Roles.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("roles.delete.title")}
          description={t("roles.delete.description")}
          confirmText={t("roles.delete.confirm")}
          cancelText={t("roles.delete.cancel")}
          loading={deleteRole.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
