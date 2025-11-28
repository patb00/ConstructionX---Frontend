import { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";

import type { JobPosition } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../../components/ui/datagrid/GridDetailPanel";
import { useJobPositions } from "../hooks/useJobPositions";
import { useDeleteJobPosition } from "../hooks/useDeleteJobPosition";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import { PermissionGate, useCan } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";
import { RowActions } from "../../../../components/ui/datagrid/RowActions";

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

    const actionsCol: GridColDef<JobPosition> = {
      field: "actions",
      headerName: t("jobPositions.actions"),
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteJobPosition.isPending;

        return (
          <RowActions
            disabled={busy}
            color="#F1B103"
            labels={{
              edit: t("jobPositions.table.edit"),
              delete: t("jobPositions.table.delete"),
            }}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
          />
        );
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

  const renderDetailPanel = useCallback(
    (params: GridRowParams<JobPosition>) => {
      return (
        <GridDetailPanel<JobPosition>
          row={params.row}
          columns={jobPositionsColumns as GridColDef<JobPosition>[]}
        />
      );
    },
    [jobPositionsColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<JobPosition>) => 220,
    []
  );

  if (error) return <div>{t("jobPositions.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<JobPosition>
        rows={jobPositionsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
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
