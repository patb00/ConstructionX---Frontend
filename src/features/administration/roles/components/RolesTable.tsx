import { useMemo, useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { extractRows } from "../../../../utilis/dataGrid";
import { useRoles } from "../hooks/useRoles";
import { useDeleteRole } from "../hooks/useDeleteRole";
import { useUpdateRole } from "../hooks/useUpdateRole";
import { isRole } from "../../utils/isRole";
import type { Role } from "..";

export default function RolesTable() {
  const { data } = useRoles();
  const deleteRole = useDeleteRole();
  const updateRole = useUpdateRole();

  const rows = useMemo(() => extractRows<Role>(data, isRole), [data]);

  const [editing, setEditing] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);

  const startEdit = (r: Role) =>
    setEditing({ id: r.id, name: r.name, description: r.description });

  const cancelEdit = () => setEditing(null);

  const saveEdit = (r: Role) => {
    if (!editing) return;
    updateRole.mutate(
      {
        id: r.id,
        name: editing.name,
        description: editing.description,
      },
      { onSuccess: () => setEditing(null) }
    );
  };

  const handleDelete = (r: Role) => {
    deleteRole.mutate(r.id);
  };

  const columns = useMemo<GridColDef<Role>[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        flex: 1.5,
        minWidth: 250,
        renderCell: (params) => (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {params.row.id}
          </Box>
        ),
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 140,
        renderCell: (params) => {
          const r = params.row;
          const isThisEditing = editing?.id === r.id;
          return (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              {!isThisEditing ? (
                <span>{r.name}</span>
              ) : (
                <TextField
                  size="small"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                  fullWidth
                />
              )}
            </Box>
          );
        },
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const r = params.row;
          const isThisEditing = editing?.id === r.id;
          return (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              {!isThisEditing ? (
                <span>{r.description}</span>
              ) : (
                <TextField
                  size="small"
                  value={editing.description}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev
                    )
                  }
                  fullWidth
                />
              )}
            </Box>
          );
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 100,
        getActions: (params) => {
          const r = params.row;
          const isThisEditing = editing?.id === r.id;

          // per-row busy flags
          const isUpdating =
            updateRole.isPending && (updateRole.variables as any)?.id === r.id;
          const isDeleting =
            deleteRole.isPending && (deleteRole.variables as any) === r.id;
          const busy = isUpdating || isDeleting;

          if (!isThisEditing) {
            return [
              <GridActionsCellItem
                key="edit"
                icon={<EditIcon fontSize="small" />}
                label="Edit"
                disabled={busy}
                onClick={() => startEdit(r)}
              />,
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon fontSize="small" color="error" />}
                label="Delete"
                disabled={busy}
                onClick={() => handleDelete(r)}
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
              onClick={() => saveEdit(r)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CloseIcon fontSize="small" />}
              label="Cancel"
              disabled={isUpdating}
              onClick={cancelEdit}
            />,
          ];
        },
      },
    ],
    [
      editing,
      updateRole.isPending,
      updateRole.variables,
      deleteRole.isPending,
      deleteRole.variables,
    ]
  );

  return (
    <ReusableDataGrid<Role>
      rows={rows}
      columns={columns}
      getRowId={(r) => r.id}
      pageSize={10}
    />
  );
}
