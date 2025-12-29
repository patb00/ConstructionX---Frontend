import { useMemo, useState, useCallback } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useDeleteVehicleBusinessTrip } from "../hooks/useDeleteVehicleBusinessTrip";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { VehicleBusinessTrip } from "..";

import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { useVehicleBusinessTrips } from "../hooks/useVehicleBusinessTrips";

export default function VehicleBusinessTripsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();

  const {
    vehicleBusinessTripsRows,
    vehicleBusinessTripsColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useVehicleBusinessTrips();

  const deleteTrip = useDeleteVehicleBusinessTrip();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<VehicleBusinessTrip | null>(
    null
  );

  const requestDelete = useCallback((row: VehicleBusinessTrip) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteTrip.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteTrip.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;

    const id = (pendingRow as any).id;
    deleteTrip.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteTrip, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<VehicleBusinessTrip>[]>(() => {
    const base = vehicleBusinessTripsColumns.slice();

    const canEdit = can({ permission: "Permission.Vehicles.Update" });
    const canDelete = can({ permission: "Permission.Vehicles.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<VehicleBusinessTrip> = {
      field: "actions",
      headerName: t("vehicleBusinessTrips.actions"),
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const id = (params.row as any).id;
        const busy = deleteTrip.isPending;

        return (
          <RowActions
            disabled={busy}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(params.row) : undefined}
            labels={{
              edit: t("vehicleBusinessTrips.table.edit"),
              delete: t("vehicleBusinessTrips.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    vehicleBusinessTripsColumns,
    can,
    deleteTrip.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) {
    return <div>{t("vehicleBusinessTrips.list.error")}</div>;
  }

  return (
    <>
      <ReusableDataGrid<VehicleBusinessTrip>
        rows={vehicleBusinessTripsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      <PermissionGate guard={{ permission: "Permission.Vehicles.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("vehicleBusinessTrips.delete.title")}
          description={t("vehicleBusinessTrips.delete.description")}
          confirmText={t("vehicleBusinessTrips.delete.confirm")}
          cancelText={t("vehicleBusinessTrips.delete.cancel")}
          loading={deleteTrip.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
