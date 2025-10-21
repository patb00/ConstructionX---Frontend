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

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useDeleteTool } from "../hooks/useDeleteTool";
import { useTools } from "../hooks/useTools";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { Tool } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";

export default function ToolsTable() {
  const { t } = useTranslation();
  const { toolsRows, toolsColumns, error, isLoading } = useTools();
  const deleteTool = useDeleteTool();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<Tool | null>(null);

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
    const base = toolsColumns.map((c) => {
      if (
        c.field === "name" ||
        c.field === "inventoryNumber" ||
        c.field === "serialNumber" ||
        c.field === "manufacturer" ||
        c.field === "model" ||
        c.field === "status" ||
        c.field === "condition" ||
        c.field === "description"
      ) {
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
        } as GridColDef<Tool>;
      }
      return c;
    });

    const canEdit = can({ permission: "Permission.Tools.Update" });
    const canDelete = can({ permission: "Permission.Tools.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridActionsColDef<Tool> = {
      field: "actions",
      type: "actions",
      headerName: t("tools.actions"),
      width: 120,
      getActions: (
        params: GridRowParams<Tool>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteTool.isPending;

        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canEdit) {
          items.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title={t("tools.table.edit")}>
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label={t("tools.table.edit")}
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
                <Tooltip title={t("tools.table.delete")}>
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label={t("tools.table.delete")}
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
  }, [toolsColumns, can, deleteTool.isPending, navigate, requestDelete, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>{t("tools.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<Tool>
        rows={toolsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        stickyRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
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
