import { useMemo, useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCompanies } from "../hooks/useCompanies";
import { useDeleteCompany } from "../hooks/useDeleteCompany";
import { useUpdateCompany } from "../hooks/useUpdateCompany";
import { extractRows } from "../../../../utilis/dataGrid";
import type { Company } from "..";
import { isCompany } from "../../utils/isCompany";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";

const pad = (n: number) => String(n).padStart(2, "0");
function isoToLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
function localInputToIso(local: string): string {
  return new Date(local).toISOString();
}

export default function CompaniesTable() {
  const { data } = useCompanies();
  const deleteCompany = useDeleteCompany();
  const updateCompany = useUpdateCompany();

  const rows = useMemo(() => extractRows<Company>(data, isCompany), [data]);

  const [editing, setEditing] = useState<{
    id: number | string;
    name: string;
    dateOfCreation: string;
  } | null>(null);

  const startEdit = (c: Company) =>
    setEditing({
      id: c.id,
      name: c.name,
      dateOfCreation: isoToLocalInput(c.dateOfCreation),
    });

  const cancelEdit = () => setEditing(null);

  const saveEdit = (c: Company) => {
    if (!editing) return;
    updateCompany.mutate(
      {
        id: c.id as number,
        name: editing.name,
        dateOfCreation: localInputToIso(editing.dateOfCreation),
      },
      { onSuccess: () => setEditing(null) }
    );
  };

  const handleDelete = (c: Company) => {
    deleteCompany.mutate(c.id as number);
  };

  const columns = useMemo<GridColDef<Company>[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        flex: 1,
        minWidth: 100,
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1.5,
        minWidth: 180,
        renderCell: (params) => {
          const c = params.row;
          const isThisEditing = editing?.id === c.id;
          if (!isThisEditing) return <span>{c.name}</span>;
          return (
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
                value={editing.name}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
                fullWidth
              />
            </Box>
          );
        },
      },
      {
        field: "dateOfCreation",
        headerName: "Date of creation",
        flex: 1.5,
        minWidth: 220,
        type: "dateTime",
        valueGetter: (_v, row) =>
          row.dateOfCreation ? new Date(row.dateOfCreation) : null,
        renderCell: (params) => {
          const c = params.row;
          const isThisEditing = editing?.id === c.id;
          if (!isThisEditing) {
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
                {c.dateOfCreation
                  ? new Date(c.dateOfCreation).toLocaleString()
                  : ""}
              </Box>
            );
          }
          const saving =
            updateCompany.isPending &&
            (updateCompany.variables as any)?.id === c.id;

          return (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                type="datetime-local"
                size="small"
                value={editing.dateOfCreation}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, dateOfCreation: e.target.value } : prev
                  )
                }
                disabled={saving}
                fullWidth
              />
            </Box>
          );
        },
      },

      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 180,
        getActions: (params) => {
          const c = params.row;
          const isThisEditing = editing?.id === c.id;
          const isUpdating =
            updateCompany.isPending &&
            (updateCompany.variables as any)?.id === c.id;
          const busy = isUpdating || deleteCompany.isPending;

          if (!isThisEditing) {
            return [
              <GridActionsCellItem
                key="edit"
                icon={<EditIcon fontSize="small" />}
                label="Edit"
                disabled={busy}
                onClick={() => startEdit(c)}
              />,
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon fontSize="small" color="error" />}
                label="Delete"
                disabled={busy}
                onClick={() => handleDelete(c)}
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
              onClick={() => saveEdit(c)}
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
      updateCompany.isPending,
      updateCompany.variables,
      deleteCompany.isPending,
    ]
  );

  return (
    <ReusableDataGrid<Company>
      rows={rows}
      columns={columns}
      getRowId={(r) => r.id}
      pageSize={10}
    />
  );
}
