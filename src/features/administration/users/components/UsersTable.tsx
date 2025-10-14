import { useMemo, useState, useCallback } from "react";
import { Box, Chip, Tooltip } from "@mui/material";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
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
import { CircularProgress } from "@mui/material";

export default function UsersTable() {
  const navigate = useNavigate();
  const { usersColumns, usersRows, error } = useUsers();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const updateStatus = useActivateUser();

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

    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<User> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 280,
      getActions: (params) => {
        const u = params.row;

        const isUpdating =
          updateUser.isPending && (updateUser.variables as any)?.id === u.id;
        const isToggling =
          updateStatus.isPending &&
          (updateStatus.variables as any)?.userId === u.id;
        const isDeleting =
          deleteUser.isPending && (deleteUser.variables as any) === u.id;
        const busy = isUpdating || isToggling || isDeleting;

        return [
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
          />,
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
          />,
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
          ),
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
          />,
        ];
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
  ]);

  if (error) return <div>Neuspjelo učitavanje korisnika.</div>;

  return (
    <>
      <ReusableDataGrid<User>
        rows={usersRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        pageSize={10}
        stickyRightField="actions"
      />

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

      {rolesDialogUser && (
        <UserRolesDialog
          userId={rolesDialogUser}
          open
          onClose={() => setRolesDialogUser(null)}
        />
      )}
    </>
  );
}
