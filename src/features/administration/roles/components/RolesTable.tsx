import { useMemo, useState, useCallback } from "react";
import { Box, Tooltip } from "@mui/material";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useRoles } from "../hooks/useRoles";
import { useDeleteRole } from "../hooks/useDeleteRole";
import type { Role } from "..";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";

export default function RolesTable() {
  const navigate = useNavigate();
  const { rolesColumns, rolesRows, error } = useRoles();
  const deleteRole = useDeleteRole();

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

    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Role> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 180,
      getActions: (params) => {
        const r = params.row;
        const busy = deleteRole.isPending;

        return [
          <GridActionsCellItem
            key="edit"
            icon={
              <Tooltip title="Uredi ulogu">
                <EditIcon fontSize="small" />
              </Tooltip>
            }
            label="Uredi ulogu"
            disabled={busy}
            onClick={() => navigate(`${r.id}/edit`)}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              <Tooltip title="Izbriši ulogu">
                <DeleteIcon fontSize="small" color="error" />
              </Tooltip>
            }
            label="Obriši"
            disabled={busy}
            onClick={() => requestDelete(r)}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key="permissions"
            icon={
              <Tooltip title="Dozvole (Permissions)">
                <SecurityIcon fontSize="small" color="primary" />
              </Tooltip>
            }
            label="Permissions"
            onClick={() =>
              navigate(`/app/administration/roles/${params.id}/permissions`)
            }
            showInMenu={false}
          />,
        ];
      },
    };

    return [...base, actionsCol];
  }, [rolesColumns, deleteRole.isPending, navigate, requestDelete]);

  if (error) return <div>Failed to load roles</div>;

  return (
    <>
      <ReusableDataGrid<Role>
        rows={rolesRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Obriši ulogu?"
        description={`Jeste li sigurni da želite obrisati ulogu ?`}
        confirmText="Obriši"
        cancelText="Odustani"
        loading={deleteRole.isPending}
        disableBackdropClose
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}
