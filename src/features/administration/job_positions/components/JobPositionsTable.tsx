import { useMemo, useState, useCallback } from "react";
import { Box, Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  type GridColDef,
  type GridActionsColDef,
  type GridRowParams,
  type GridActionsCellItemProps,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { JobPosition } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useJobPositions } from "../hooks/useJobPositions";
import { useDeleteJobPosition } from "../hooks/useDeleteJobPosition";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import { PermissionGate, useCan } from "../../../../lib/permissions";

export default function JobPositionsTable() {
  const { jobPositionsRows, jobPositionsColumns, error, isLoading } =
    useJobPositions();
  const deleteJobPosition = useDeleteJobPosition();
  const navigate = useNavigate();
  const can = useCan();

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

    const canEdit = can({ permission: "Permission.JobPositions.Update" });
    const canDelete = can({ permission: "Permission.JobPositions.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridActionsColDef<JobPosition> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 140,
      getActions: (
        params: GridRowParams<JobPosition>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteJobPosition.isPending;

        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canEdit) {
          items.push(
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
            />
          );
        }

        if (canDelete) {
          items.push(
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
            />
          );
        }

        return items;
      },
    };

    return [...base, actionsCol];
  }, [
    jobPositionsColumns,
    can,
    deleteJobPosition.isPending,
    navigate,
    requestDelete,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>Radna mjesta.</div>;

  return (
    <>
      <ReusableDataGrid<JobPosition>
        rows={jobPositionsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        stickyRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
      />

      <PermissionGate guard={{ permission: "Permission.JobPositions.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title="Izbriši radno mjesto?"
          description="Jeste li sigurni da želite izbrisati radno mjesto ?"
          confirmText="Obriši"
          cancelText="Odustani"
          loading={deleteJobPosition.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
