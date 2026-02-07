// src/features/vehicleRepairs/components/VehicleRepairsTable.tsx
import { useMemo, useState, useCallback } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useVehicleRepairs } from "../hooks/useVehicleRepairs";
import { useDeleteVehicleRepair } from "../hooks/useDeleteVehicleRepair";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { VehicleRepair } from "..";

import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

export default function VehicleRepairsTable() {
  const { t } = useTranslation();

  const {
    vehicleRepairsRows,
    vehicleRepairsColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useVehicleRepairs();

  const deleteRepair = useDeleteVehicleRepair();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<VehicleRepair | null>(null);

  const requestDelete = useCallback((row: VehicleRepair) => {
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

  const columnsWithActions = useMemo<GridColDef<VehicleRepair>[]>(() => {
    const base = vehicleRepairsColumns.slice();

    const canEdit = can({ permission: "Permission.Vehicles.Update" });
    const canDelete = can({ permission: "Permission.Vehicles.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<VehicleRepair> = {
      field: "actions",
      headerName: t("vehicleRepairs.actions"),
      width: 190,
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
            labels={{
              view: t("vehicleRepairs.table.detailView"),
              edit: t("vehicleRepairs.table.edit"),
              delete: t("vehicleRepairs.table.delete"),
            }}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(params.row) : undefined}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    vehicleRepairsColumns,
    can,
    deleteRepair.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<VehicleRepair>) => (
      <GridDetailPanel<VehicleRepair>
        row={params.row}
        columns={vehicleRepairsColumns as GridColDef<VehicleRepair>[]}
      />
    ),
    [vehicleRepairsColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<VehicleRepair>) => 220,
    []
  );

  if (error) return <div>{t("vehicleRepairs.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<VehicleRepair>
        mobilePrimaryField="name"
        rows={vehicleRepairsRows}
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

      <PermissionGate guard={{ permission: "Permission.Vehicles.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("vehicleRepairs.delete.title")}
          description={t("vehicleRepairs.delete.description")}
          confirmText={t("vehicleRepairs.delete.confirm")}
          cancelText={t("vehicleRepairs.delete.cancel")}
          loading={deleteRepair.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
