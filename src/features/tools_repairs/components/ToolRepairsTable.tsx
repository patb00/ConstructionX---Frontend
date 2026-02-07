// src/features/toolRepairs/components/ToolRepairsTable.tsx
import { useMemo, useState, useCallback } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useToolRepairs } from "../hooks/useToolRepairs";
import { useDeleteToolRepair } from "../hooks/useDeleteToolRepair";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { ToolRepair } from "..";

import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

export default function ToolRepairsTable() {
  const { t } = useTranslation();

  const {
    toolRepairsRows,
    toolRepairsColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useToolRepairs();

  const deleteRepair = useDeleteToolRepair();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<ToolRepair | null>(null);

  const requestDelete = useCallback((row: ToolRepair) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteRepair.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteRepair.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;

    deleteRepair.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteRepair, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<ToolRepair>[]>(() => {
    const base = toolRepairsColumns.slice();

    const canEdit = can({ permission: "Permission.Tools.Update" });
    const canDelete = can({ permission: "Permission.Tools.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<ToolRepair> = {
      field: "actions",
      headerName: t("toolRepairs.actions"),
      width: 180,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const id = (params.row as any).id;
        const busy = deleteRepair.isPending;

        return (
          <RowActions
            disabled={busy}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(params.row) : undefined}
            labels={{
              edit: t("toolRepairs.table.edit"),
              delete: t("toolRepairs.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    toolRepairsColumns,
    can,
    deleteRepair.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<ToolRepair>) => (
      <GridDetailPanel<ToolRepair>
        row={params.row}
        columns={toolRepairsColumns as GridColDef<ToolRepair>[]}
      />
    ),
    [toolRepairsColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<ToolRepair>) => 220,
    []
  );

  if (error) return <div>{t("toolRepairs.list.error")}</div>;

  console.log(columnsWithActions);

  return (
    <>
      <ReusableDataGrid<ToolRepair>
        mobilePrimaryField="name"
        rows={toolRepairsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      <PermissionGate guard={{ permission: "Permission.Tools.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("toolRepairs.delete.title")}
          description={t("toolRepairs.delete.description")}
          confirmText={t("toolRepairs.delete.confirm")}
          cancelText={t("toolRepairs.delete.cancel")}
          loading={deleteRepair.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
