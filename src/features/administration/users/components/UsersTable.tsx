import { useMemo, useState } from "react";
import { Box, CircularProgress, TextField, Chip } from "@mui/material";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import SecurityIcon from "@mui/icons-material/Security";

import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import type { User } from "..";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useActivateUser } from "../hooks/useActivateUser";
import UserRolesDialog from "./UserRolesDialog";

export default function UsersTable() {
  const { usersColumns, usersRows, error } = useUsers();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const updateStatus = useActivateUser();

  const [editing, setEditing] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  } | null>(null);

  const [rolesDialogUser, setRolesDialogUser] = useState<string | null>(null);

  const startEdit = (u: User) =>
    setEditing({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      phoneNumber: u.phoneNumber ?? "",
    });

  const cancelEdit = () => setEditing(null);

  const saveEdit = (u: User) => {
    if (!editing) return;
    updateUser.mutate(
      {
        id: u.id,
        firstName: editing.firstName,
        lastName: editing.lastName,
        phoneNumber: editing.phoneNumber,
      },
      { onSuccess: () => setEditing(null) }
    );
  };

  const handleDelete = (u: User) => deleteUser.mutate(u.id);
  const toggleStatus = (u: User) =>
    updateStatus.mutate({ userId: u.id, activation: !u.isActive });

  const columnsWithActions = useMemo<GridColDef<User>[]>(() => {
    const base = usersColumns.map((c) => {
      if (c.field === "firstName") {
        return {
          ...c,
          renderCell: (params) => {
            const u = params.row;
            const isThisEditing = editing?.id === u.id;
            return !isThisEditing ? (
              <span>{u.firstName}</span>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  value={editing.firstName}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, firstName: e.target.value } : p
                    )
                  }
                  fullWidth
                />
              </Box>
            );
          },
        } as GridColDef<User>;
      }

      if (c.field === "lastName") {
        return {
          ...c,
          renderCell: (params) => {
            const u = params.row;
            const isThisEditing = editing?.id === u.id;
            return !isThisEditing ? (
              <span>{u.lastName}</span>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  value={editing.lastName}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, lastName: e.target.value } : p
                    )
                  }
                  fullWidth
                />
              </Box>
            );
          },
        } as GridColDef<User>;
      }

      if (c.field === "phoneNumber") {
        return {
          ...c,
          renderCell: (params) => {
            const u = params.row;
            const isThisEditing = editing?.id === u.id;
            return !isThisEditing ? (
              <span>{u.phoneNumber ?? ""}</span>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  value={editing.phoneNumber}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, phoneNumber: e.target.value } : p
                    )
                  }
                  fullWidth
                />
              </Box>
            );
          },
        } as GridColDef<User>;
      }

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
      headerName: "Actions",
      width: 260,
      getActions: (params) => {
        const u = params.row;
        const isThisEditing = editing?.id === u.id;

        const isUpdating =
          updateUser.isPending && (updateUser.variables as any)?.id === u.id;
        const isToggling =
          updateStatus.isPending &&
          (updateStatus.variables as any)?.userId === u.id;
        const isDeleting =
          deleteUser.isPending && (deleteUser.variables as any) === u.id;
        const busy = isUpdating || isToggling || isDeleting;

        if (!isThisEditing) {
          return [
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon fontSize="small" />}
              label="Edit"
              disabled={busy}
              onClick={() => startEdit(u)}
              showInMenu={false}
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon fontSize="small" color="error" />}
              label="Delete"
              disabled={isDeleting}
              onClick={() => handleDelete(u)}
              showInMenu={false}
            />,
            u.isActive ? (
              <GridActionsCellItem
                key="deactivate"
                icon={
                  isToggling ? (
                    <CircularProgress size={16} />
                  ) : (
                    <BlockIcon fontSize="small" />
                  )
                }
                label="Deactivate"
                disabled={busy}
                onClick={() => toggleStatus(u)}
                showInMenu={false}
              />
            ) : (
              <GridActionsCellItem
                key="activate"
                icon={
                  isToggling ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CheckIcon fontSize="small" />
                  )
                }
                label="Activate"
                disabled={busy}
                onClick={() => toggleStatus(u)}
                showInMenu={false}
              />
            ),
            <GridActionsCellItem
              key="roles"
              icon={<SecurityIcon fontSize="small" color="primary" />}
              label="Manage Roles"
              onClick={() => setRolesDialogUser(u.id)}
              showInMenu={false}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="save"
            icon={
              isUpdating ? (
                <CircularProgress size={16} />
              ) : (
                <SaveIcon fontSize="small" />
              )
            }
            label={isUpdating ? "Saving..." : "Save"}
            disabled={isUpdating}
            onClick={() => saveEdit(u)}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key="cancel"
            icon={<CloseIcon fontSize="small" />}
            label="Cancel"
            disabled={isUpdating}
            onClick={cancelEdit}
            showInMenu={false}
          />,
        ];
      },
    };

    return [...base, actionsCol];
  }, [
    usersColumns,
    editing,
    updateUser.isPending,
    updateUser.variables,
    updateStatus.isPending,
    updateStatus.variables,
    deleteUser.isPending,
    deleteUser.variables,
  ]);

  if (error) return <div>Failed to load users</div>;

  return (
    <>
      <ReusableDataGrid<User>
        rows={usersRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        pageSize={10}
        stickyRightField="actions"
      />
      {rolesDialogUser && (
        <UserRolesDialog
          userId={rolesDialogUser}
          open={!!rolesDialogUser}
          onClose={() => setRolesDialogUser(null)}
        />
      )}
    </>
  );
}
