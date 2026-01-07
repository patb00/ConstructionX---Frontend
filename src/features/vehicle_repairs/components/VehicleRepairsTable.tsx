import { useMemo, useState, useCallback } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { VehicleRepair } from "..";
import { useVehicleRepairsAll } from "../hooks/useVehicleRepairsAll";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { useDeleteVehicleRepair } from "../hooks/useDeleteVehicleRepair";
import { PermissionGate, useCan } from "../../../lib/permissions";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString()
    : String(value);
};

const formatNumber = (value?: number | null) => {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
};

export default function VehicleRepairsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();
  const { repairs, total, paginationModel, setPaginationModel, error, isLoading } =
    useVehicleRepairsAll();

  const deleteRepair = useDeleteVehicleRepair();

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
    deleteRepair.mutate(pendingRow.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteRepair, pendingRow]);

  const baseColumns = useMemo<GridColDef<VehicleRepair>[]>(
    () => [
      {
        field: "name",
        headerName: t("common.columns.name"),
        minWidth: 180,
        flex: 1,
      },
      {
        field: "registrationNumber",
        headerName: t("common.columns.registrationNumber"),
        minWidth: 180,
      },
      {
        field: "model",
        headerName: t("common.columns.model"),
        minWidth: 160,
      },
      {
        field: "yearOfManufacturing",
        headerName: t("common.columns.yearOfManufacturing"),
        minWidth: 170,
      },
      {
        field: "vehicleType",
        headerName: t("common.columns.vehicleType"),
        minWidth: 160,
        valueFormatter: (params) => params.value ?? "—",
      },
      {
        field: "horsePower",
        headerName: t("common.columns.horsePower"),
        minWidth: 140,
        valueFormatter: (params) => formatNumber(params.value),
      },
      {
        field: "repairDate",
        headerName: t("common.columns.repairDate"),
        minWidth: 150,
        valueFormatter: (params) => formatDate(params.value),
      },
      {
        field: "cost",
        headerName: t("common.columns.cost"),
        minWidth: 130,
        valueFormatter: (params) => formatNumber(params.value),
      },
      {
        field: "condition",
        headerName: t("common.columns.condition"),
        minWidth: 160,
      },
      {
        field: "description",
        headerName: t("common.columns.description"),
        minWidth: 220,
        flex: 1,
        valueFormatter: (params) => params.value ?? "—",
      },
    ],
    [t]
  );

  const columnsWithActions = useMemo<GridColDef<VehicleRepair>[]>(() => {
    const base = baseColumns.slice();
    const canEdit = can({ permission: "Permission.Vehicles.Update" });
    const canDelete = can({ permission: "Permission.Vehicles.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<VehicleRepair> = {
      field: "actions",
      headerName: t("vehicleRepairs.actions"),
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const id = (params.row as VehicleRepair).id;
        const busy = deleteRepair.isPending;

        return (
          <RowActions
            disabled={busy}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(params.row) : undefined}
            labels={{
              edit: t("vehicleRepairs.table.edit"),
              delete: t("vehicleRepairs.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    baseColumns,
    can,
    deleteRepair.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) {
    return <div>{t("vehicleRepairs.list.error")}</div>;
  }

  return (
    <>
      <ReusableDataGrid<VehicleRepair>
        storageKey="vehicle-repairs"
        rows={repairs}
        columns={columnsWithActions}
        getRowId={(row) => String(row.id)}
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
