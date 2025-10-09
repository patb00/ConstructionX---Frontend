import { useMemo, useState, useCallback } from "react";
import { Box, Tooltip } from "@mui/material";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { JobPosition } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useJobPositions } from "../hooks/useJobPositions";
import { useDeleteJobPosition } from "../hooks/useDeleteJobPosition";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";

export default function JobPositionsTable() {
  const { jobPositionsRows, jobPositionsColumns, error } = useJobPositions();
  const deleteJobPosition = useDeleteJobPosition();
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<JobPosition | null>(null);

  const requestDelete = useCallback((row: JobPosition) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteJobPosition.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteJobPosition.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;
    deleteJobPosition.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteJobPosition, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<JobPosition>[]>(() => {
    const base = jobPositionsColumns.map((c) => {
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
        } as GridColDef<JobPosition>;
      }
      return c;
    });

    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<JobPosition> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 140,
      getActions: (params) => {
        const row = params.row as JobPosition;
        const id = (row as any).id;
        const busy = deleteJobPosition.isPending;

        return [
          <GridActionsCellItem
            key="edit"
            icon={
              <Tooltip title="Uredi radno mjesto">
                <EditIcon fontSize="small" />
              </Tooltip>
            }
            label="Uredi"
            disabled={busy}
            onClick={() => navigate(`${id}/edit`)}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              <Tooltip title="Izbriši radno mjesto">
                <DeleteIcon fontSize="small" color="error" />
              </Tooltip>
            }
            label="Izbriši"
            disabled={busy}
            onClick={() => requestDelete(row)}
            showInMenu={false}
          />,
        ];
      },
    };

    return [...base, actionsCol];
  }, [
    jobPositionsColumns,
    deleteJobPosition.isPending,
    navigate,
    requestDelete,
  ]);

  if (error) return <div>Neuspjelo učitavanje radnih mjesta.</div>;

  return (
    <>
      <ReusableDataGrid<JobPosition>
        rows={jobPositionsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Izbriši radno mjesto?"
        description={`Jeste li sigurni da želite izbrisati radno mjesto ?`}
        confirmText="Obriši"
        cancelText="Odustani"
        loading={deleteJobPosition.isPending}
        disableBackdropClose
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}
