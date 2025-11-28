import { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";

import { useTranslation } from "react-i18next";
import { useToolCategories } from "../hooks/useToolCategories";
import { useDeleteToolCategory } from "../hooks/useDeleteToolCategory";
import { useNavigate } from "react-router-dom";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { ToolCategory } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

export default function ToolCategoriesTable() {
  const { t } = useTranslation();
  const { toolCategoriesRows, toolCategoriesColumns, error, isLoading } =
    useToolCategories();
  const deleteToolCategory = useDeleteToolCategory();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<ToolCategory | null>(null);

  const requestDelete = useCallback((row: ToolCategory) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteToolCategory.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteToolCategory.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;

    deleteToolCategory.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteToolCategory, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<ToolCategory>[]>(() => {
    const base = toolCategoriesColumns.map((c) => {
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
        } as GridColDef<ToolCategory>;
      }
      return c;
    });

    const canEdit = can({ permission: "Permission.ToolCategories.Update" });
    const canDelete = can({ permission: "Permission.ToolCategories.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    return [
      ...base,
      {
        field: "actions",
        headerName: t("toolCategories.actions"),
        width: 120,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        disableColumnMenu: true,

        renderCell: (params) => {
          const row = params.row;
          const id = (row as any).id;
          const busy = deleteToolCategory.isPending;

          return (
            <RowActions
              disabled={busy}
              color="#F1B103"
              onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
              onDelete={canDelete ? () => requestDelete(row) : undefined}
              labels={{
                edit: t("toolCategories.table.edit"),
                delete: t("toolCategories.table.delete"),
              }}
            />
          );
        },
      } satisfies GridColDef<ToolCategory>,
    ];
  }, [
    toolCategoriesColumns,
    can,
    deleteToolCategory.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<ToolCategory>) => {
      return (
        <GridDetailPanel<ToolCategory>
          row={params.row}
          columns={toolCategoriesColumns as GridColDef<ToolCategory>[]}
        />
      );
    },
    [toolCategoriesColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<ToolCategory>) => 220,
    []
  );

  if (error) return <div>{t("toolCategories.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<ToolCategory>
        rows={toolCategoriesRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
      />

      <PermissionGate
        guard={{ permission: "Permission.ToolCategories.Delete" }}
      >
        <ConfirmDialog
          open={confirmOpen}
          title={t("toolCategories.delete.title")}
          description={t("toolCategories.delete.description")}
          confirmText={t("toolCategories.delete.confirm")}
          cancelText={t("toolCategories.delete.cancel")}
          loading={deleteToolCategory.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
