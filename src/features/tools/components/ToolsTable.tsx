import { useMemo, useState, useCallback } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useDeleteTool } from "../hooks/useDeleteTool";
import { useTools } from "../hooks/useTools";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { Tool } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { ToolHistoryDetails } from "./ToolsHistoryDetails";

export default function ToolsTable() {
  const { t } = useTranslation();
  const {
    toolsRows,
    toolsColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useTools();

  const deleteTool = useDeleteTool();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<Tool | null>(null);

  const [expandedIds, setExpandedIds] = useState<Set<GridRowId>>(
    () => new Set()
  );

  const requestDelete = useCallback((row: Tool) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteTool.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteTool.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;

    deleteTool.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteTool, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<Tool>[]>(() => {
    const base = [...toolsColumns];

    const canEdit = can({ permission: "Permission.Tools.Update" });
    const canDelete = can({ permission: "Permission.Tools.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Tool> = {
      field: "actions",
      headerName: t("tools.actions"),
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteTool.isPending;

        return (
          <RowActions
            disabled={busy}
            color="#F1B103"
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
            labels={{
              edit: t("tools.table.edit"),
              delete: t("tools.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [toolsColumns, can, deleteTool.isPending, navigate, requestDelete, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback((params: GridRowParams<Tool>) => {
    const toolId = Number((params.row as any).id);
    return <ToolHistoryDetails toolId={toolId} />;
  }, []);

  const getDetailPanelHeight = useCallback(() => "auto" as const, []);

  if (error) return <div>{t("tools.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<Tool>
        storageKey="tools"
        rows={toolsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="desktop-only"
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        detailPanelExpandedRowIds={expandedIds}
        onDetailPanelExpandedRowIdsChange={(ids) => {
          const arr = Array.from(ids as Set<GridRowId>);
          setExpandedIds(new Set(arr.slice(-1)));
        }}
      />

      <PermissionGate guard={{ permission: "Permission.Tools.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("tools.delete.title")}
          description={t("tools.delete.description")}
          confirmText={t("tools.delete.confirm")}
          cancelText={t("tools.delete.cancel")}
          loading={deleteTool.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
