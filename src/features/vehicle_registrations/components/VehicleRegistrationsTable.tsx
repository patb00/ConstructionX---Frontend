import { useMemo, useState, useCallback } from "react";
import { type GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useVehicleRegistrations } from "../hooks/useVehicleRegistrations";
import { useDeleteVehicleRegistration } from "../hooks/useDeleteVehicleRegistration";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { VehicleRegistration } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { alpha, useTheme } from "@mui/material";

export default function VehicleRegistrationsTable() {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    vehicleRegistrationsRows,
    vehicleRegistrationsColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useVehicleRegistrations();

  const deleteRegistration = useDeleteVehicleRegistration();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<VehicleRegistration | null>(
    null
  );

  const requestDelete = useCallback((row: VehicleRegistration) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteRegistration.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteRegistration.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;
    deleteRegistration.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteRegistration, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<VehicleRegistration>[]>(() => {
    const base = vehicleRegistrationsColumns.slice();

    const canEdit = can({
      permission: "Permission.Vehicles.Update",
    });
    const canDelete = can({
      permission: "Permission.Vehicles.Delete",
    });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<VehicleRegistration> = {
      field: "actions",
      headerName: t("vehicleRegistrations.actions"),
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const id = (params.row as any).id;
        const busy = deleteRegistration.isPending;

        return (
          <RowActions
            color="#F1B103"
            disabled={busy}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(params.row) : undefined}
            labels={{
              edit: t("vehicleRegistrations.table.edit"),
              delete: t("vehicleRegistrations.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    vehicleRegistrationsColumns,
    can,
    deleteRegistration.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<VehicleRegistration>) => (
      <GridDetailPanel<VehicleRegistration>
        row={params.row}
        columns={
          vehicleRegistrationsColumns as GridColDef<VehicleRegistration>[]
        }
      />
    ),
    [vehicleRegistrationsColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<VehicleRegistration>) => 220,
    []
  );

  if (error) return <div>{t("vehicleRegistrations.list.error")}</div>;

  const getRowClassName = useCallback((params: any) => {
    const raw = (params.row as any)?.validTo;
    if (!raw) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next = new Date(raw);
    next.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((next.getTime() - today.getTime()) / 86400000);

    return diffDays >= 0 && diffDays <= 14 ? "row--dueSoon" : "";
  }, []);

  const dueSoonRowSx = {
    "& .MuiDataGrid-row.row--dueSoon": {
      backgroundColor: `${alpha(theme.palette.error.main, 0.12)} !important`,
    },

    "& .MuiDataGrid-row.row--dueSoon .MuiDataGrid-cell": {
      backgroundColor: `${alpha(theme.palette.error.main, 0.12)} !important`,
    },

    "& .MuiDataGrid-row.row--dueSoon .MuiDataGrid-cell--pinnedRight": {
      backgroundColor: `white !important`,
    },
  };

  return (
    <>
      <ReusableDataGrid<VehicleRegistration>
        rows={vehicleRegistrationsRows}
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
        getRowClassName={getRowClassName}
        sx={dueSoonRowSx}
      />

      <PermissionGate guard={{ permission: "Permission.Vehicles.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("vehicleRegistrations.delete.title")}
          description={t("vehicleRegistrations.delete.description")}
          confirmText={t("vehicleRegistrations.delete.confirm")}
          cancelText={t("vehicleRegistrations.delete.cancel")}
          loading={deleteRegistration.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
