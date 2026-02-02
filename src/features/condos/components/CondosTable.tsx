import { useMemo, useState, useCallback } from "react";
import { type GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDeleteCondo } from "../hooks/useDeleteCondo";
import { useCondos } from "../hooks/useCondos";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { Condo } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { CondoHistoryDetails } from "./CondoHistoryDetails";

export default function CondosTable() {
  const { t } = useTranslation();
  const {
    condosRows,
    condosColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useCondos();

  const deleteCondo = useDeleteCondo();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<Condo | null>(null);

  const requestDelete = useCallback((row: Condo) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteCondo.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteCondo.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;

    deleteCondo.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteCondo, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<Condo>[]>(() => {
    const base = [...(condosColumns as GridColDef<Condo>[])];

    const canEdit = can({ permission: "Permission.Condos.Update" });
    const canDelete = can({ permission: "Permission.Condos.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Condo> = {
      field: "actions",
      headerName: t("condos.actions"),
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteCondo.isPending;

        return (
          <RowActions
            disabled={busy}
            color="#F1B103"
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
            labels={{
              edit: t("condos.table.edit"),
              delete: t("condos.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [condosColumns, can, deleteCondo.isPending, navigate, requestDelete, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback((params: GridRowParams<Condo>) => {
    const condoId = Number((params.row as any).id);
    return <CondoHistoryDetails condoId={condoId} />;
  }, []);

  const getDetailPanelHeight = useCallback(() => "auto" as const, []);

  if (error) return <div>{t("condos.list.error")}</div>;

  console.log(condosRows, "condosRows");

  return (
    <>
      <ReusableDataGrid<Condo>
        storageKey="condos"
        rows={condosRows}
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
      />

      <PermissionGate guard={{ permission: "Permission.Condos.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("condos.delete.title")}
          description={t("condos.delete.description")}
          confirmText={t("condos.delete.confirm")}
          cancelText={t("condos.delete.cancel")}
          loading={deleteCondo.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
