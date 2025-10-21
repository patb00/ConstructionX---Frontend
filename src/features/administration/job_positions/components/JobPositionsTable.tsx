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
import { useTranslation } from "react-i18next";

export default function JobPositionsTable() {
  const { t } = useTranslation();
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
      if (c.field === "name") {
        return {
          ...c,
          headerName: c.headerName ?? t("jobPositions.table.name"),
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
      if (c.field === "description") {
        return {
          ...c,
          headerName: c.headerName ?? t("jobPositions.table.description"),
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
      headerName: t("jobPositions.actions"),
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
                <Tooltip title={t("jobPositions.table.edit")}>
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label={t("jobPositions.table.edit")}
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
                <Tooltip title={t("jobPositions.table.delete")}>
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label={t("jobPositions.table.delete")}
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
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>{t("jobPositions.list.error")}</div>;

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
          title={t("jobPositions.delete.title")}
          description={t("jobPositions.delete.description")}
          confirmText={t("jobPositions.delete.confirm")}
          cancelText={t("jobPositions.delete.cancel")}
          loading={deleteJobPosition.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
