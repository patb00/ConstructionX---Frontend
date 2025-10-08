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
import type { Company } from "..";
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
  const { companiesColumns, companiesRows, error } = useCompanies();
  const deleteCompany = useDeleteCompany();
  const updateCompany = useUpdateCompany();

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

  const columnsWithActions = useMemo<GridColDef<Company>[]>(() => {
    const base = companiesColumns.map((c) => {
      if (c.field === "name") {
        return {
          ...c,
          renderCell: (params) => {
            const row = params.row;
            const isThisEditing = editing?.id === row.id;
            if (!isThisEditing) return <span>{row.name}</span>;
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
        } as GridColDef<Company>;
      }

      if (c.field === "dateOfCreation") {
        return {
          ...c,
          type: "dateTime",
          valueGetter: (_v, row) =>
            row.dateOfCreation ? new Date(row.dateOfCreation) : null,
          renderCell: (params) => {
            const row = params.row;
            const isThisEditing = editing?.id === row.id;
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
                  {row.dateOfCreation
                    ? new Date(row.dateOfCreation).toLocaleString()
                    : ""}
                </Box>
              );
            }
            const saving =
              updateCompany.isPending &&
              (updateCompany.variables as any)?.id === row.id;
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
        } as GridColDef<Company>;
      }

      return c;
    });

    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Company> = {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 180,
      getActions: (params) => {
        const row = params.row;
        const isThisEditing = editing?.id === row.id;
        const isUpdating =
          updateCompany.isPending &&
          (updateCompany.variables as any)?.id === row.id;
        const busy = isUpdating || deleteCompany.isPending;

        if (!isThisEditing) {
          return [
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon fontSize="small" />}
              label="Edit"
              disabled={busy}
              onClick={() => startEdit(row)}
              showInMenu={false}
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon fontSize="small" color="error" />}
              label="Delete"
              disabled={busy}
              onClick={() => handleDelete(row)}
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
            onClick={() => saveEdit(row)}
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
    companiesColumns,
    editing,
    updateCompany.isPending,
    updateCompany.variables,
    deleteCompany.isPending,
  ]);

  if (error) return <div>Failed to load companies</div>;

  return (
    <ReusableDataGrid<Company>
      rows={companiesRows}
      columns={columnsWithActions}
      getRowId={(r) => r.id}
      stickyRightField="actions"
    />
  );
}
