import { useMemo, useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import type { JobPosition } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useJobPositions } from "../hooks/useJobPositions";
import { useDeleteJobPosition } from "../hooks/useDeleteJobPosition";
import { useUpdateJobPosition } from "../hooks/useUpdateJobPosition";

export default function JobPositionsTable() {
  const { jobPositionsRows, jobPositionsColumns, error } = useJobPositions();
  const deleteJobPosition = useDeleteJobPosition();
  const updateJobPosition = useUpdateJobPosition();

  const [editing, setEditing] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);

  const startEdit = (r: JobPosition) =>
    setEditing({
      id: String((r as any).id),
      name: (r as any).name ?? "",
      description: (r as any).description ?? "",
    });

  const cancelEdit = () => setEditing(null);

  const saveEdit = (r: JobPosition) => {
    if (!editing) return;

    const originalId = (r as any).id;
    updateJobPosition.mutate(
      {
        id: originalId,
        name: editing.name,
        description: editing.description,
      } as any,
      { onSuccess: () => setEditing(null) }
    );
  };

  const handleDelete = (r: JobPosition) => {
    const originalId = (r as any).id;
    deleteJobPosition.mutate(originalId as any);
  };

  const columnsWithActions = useMemo<GridColDef<JobPosition>[]>(() => {
    const base = jobPositionsColumns.map((c) => {
      if (c.field === "name" || c.field === "description") {
        const field = c.field as "name" | "description";
        return {
          ...c,
          renderCell: (params) => {
            const r = params.row as JobPosition;
            const rid = String((r as any).id);
            const isThisEditing = editing?.id === rid;
            const value = isThisEditing
              ? (editing as any)[field]
              : (r as any)[field];

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
                  <span>{value}</span>
                ) : (
                  <TextField
                    size="small"
                    value={value ?? ""}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, [field]: e.target.value } : prev
                      )
                    }
                    fullWidth
                  />
                )}
              </Box>
            );
          },
        } as GridColDef<JobPosition>;
      }
      return c;
    });

    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<JobPosition> = {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => {
        const r = params.row as JobPosition;
        const rid = String((r as any).id);
        const isThisEditing = editing?.id === rid;

        const isUpdating =
          updateJobPosition.isPending &&
          String((updateJobPosition.variables as any)?.id) === rid;

        const isDeleting =
          deleteJobPosition.isPending &&
          String(deleteJobPosition.variables as any) === rid;

        const busy = isUpdating || isDeleting;

        if (!isThisEditing) {
          return [
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon fontSize="small" />}
              label="Edit"
              disabled={busy}
              onClick={() => startEdit(r)}
              showInMenu={false}
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon fontSize="small" color="error" />}
              label="Delete"
              disabled={busy}
              onClick={() => handleDelete(r)}
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
            onClick={() => saveEdit(r)}
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
    jobPositionsColumns,
    editing,
    updateJobPosition.isPending,
    updateJobPosition.variables,
    deleteJobPosition.isPending,
    deleteJobPosition.variables,
  ]);

  if (error) return <div>Failed to load job positions</div>;

  console.log(jobPositionsRows, jobPositionsColumns);
  return (
    <ReusableDataGrid<JobPosition>
      rows={jobPositionsRows}
      columns={columnsWithActions}
      getRowId={(r) => String((r as any).id)}
    />
  );
}
