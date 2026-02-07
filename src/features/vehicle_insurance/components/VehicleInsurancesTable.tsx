import { useMemo, useState, useCallback } from "react";
import type { GridColDef, GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useDeleteVehicleInsurance } from "../hooks/useDeleteVehicleInsurance";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { VehicleInsurance } from "..";

import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { useVehicleInsurances } from "../hooks/useVehicleInsurances";

export default function VehicleInsurancesTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();

  const {
    vehicleInsurancesRows,
    vehicleInsurancesColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useVehicleInsurances();

  const deleteInsurance = useDeleteVehicleInsurance();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<VehicleInsurance | null>(null);

  const requestDelete = useCallback((row: VehicleInsurance) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteInsurance.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteInsurance.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;

    const id = (pendingRow as any).id;
    deleteInsurance.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteInsurance, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<VehicleInsurance>[]>(() => {
    const base = vehicleInsurancesColumns.slice();

    const canEdit = can({ permission: "Permission.Vehicles.Update" });
    const canDelete = can({
      permission: "Permission.Vehicles.Delete",
    });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<VehicleInsurance> = {
      field: "actions",
      headerName: t("vehicleInsurances.actions"),
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const id = (params.row as any).id;
        const busy = deleteInsurance.isPending;

        return (
          <RowActions
            disabled={busy}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(params.row) : undefined}
            labels={{
              edit: t("vehicleInsurances.table.edit"),
              delete: t("vehicleInsurances.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    vehicleInsurancesColumns,
    can,
    deleteInsurance.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<VehicleInsurance>) => (
      <GridDetailPanel<VehicleInsurance>
        row={params.row}
        columns={
          vehicleInsurancesColumns as GridColDef<VehicleInsurance>[]
        }
      />
    ),
    [vehicleInsurancesColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<VehicleInsurance>) => 220,
    []
  );

  if (error) {
    return <div>{t("vehicleInsurances.list.error")}</div>;
  }

  return (
    <>
      <ReusableDataGrid<VehicleInsurance>
        mobilePrimaryField="policyNumber"
        rows={vehicleInsurancesRows}
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
          title={t("vehicleInsurances.delete.title")}
          description={t("vehicleInsurances.delete.description")}
          confirmText={t("vehicleInsurances.delete.confirm")}
          cancelText={t("vehicleInsurances.delete.cancel")}
          loading={deleteInsurance.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
