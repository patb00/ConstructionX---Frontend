import { useMemo, useState, useCallback } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useVehicles } from "../hooks/useVehicles";
import { useDeleteVehicle } from "../hooks/useDeleteVehicle";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { Vehicle } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { VehicleHistoryDetails } from "./VehicleHistoryDetails";
import { Box } from "@mui/material";

export default function VehiclesTable() {
  const { t } = useTranslation();
  const {
    vehiclesRows,
    vehiclesColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useVehicles();

  const deleteVehicle = useDeleteVehicle();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<Vehicle | null>(null);

  const [expandedIds, setExpandedIds] = useState<Set<GridRowId>>(
    () => new Set()
  );

  const requestDelete = useCallback((row: Vehicle) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteVehicle.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteVehicle.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;

    deleteVehicle.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteVehicle, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<Vehicle>[]>(() => {
    const base = vehiclesColumns.slice();

    const canEdit = can({ permission: "Permission.Vehicles.Update" });
    const canDelete = can({ permission: "Permission.Vehicles.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Vehicle> = {
      field: "actions",
      headerName: t("vehicles.actions"),
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const id = (params.row as any).id;
        const busy = deleteVehicle.isPending;

        return (
          <RowActions
            color="#F1B103"
            disabled={busy}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(params.row) : undefined}
            labels={{
              edit: t("vehicles.table.edit"),
              delete: t("vehicles.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    vehiclesColumns,
    can,
    deleteVehicle.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback((params: GridRowParams<Vehicle>) => {
    const vehicleId = Number((params.row as any).id);
    return (
      <Box sx={{ outline: "1px solid red" }}>
        <VehicleHistoryDetails vehicleId={vehicleId} />
      </Box>
    );
  }, []);

  const getDetailPanelHeight = useCallback(() => "auto" as const, []);

  if (error) {
    return <div>{t("vehicles.list.error")}</div>;
  }

  return (
    <>
      <ReusableDataGrid<Vehicle>
        rows={vehiclesRows}
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

      <PermissionGate guard={{ permission: "Permission.Vehicles.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("vehicles.delete.title")}
          description={t("vehicles.delete.description")}
          confirmText={t("vehicles.delete.confirm")}
          cancelText={t("vehicles.delete.cancel")}
          loading={deleteVehicle.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
