import { useMemo } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { PermissionGate, useCan } from "../../../lib/permissions";
import type { VehicleBusinessTrip } from "..";

import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
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

  const columnsWithActions = useMemo<GridColDef<VehicleBusinessTrip>[]>(() => {
    const base = vehicleBusinessTripsColumns.slice();

    const canEdit = can({ permission: "Permission.Vehicles.Update" });

    // 🚫 No edit permission → no actions column at all
    if (!canEdit) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<VehicleBusinessTrip> = {
      field: "actions",
      headerName: t("vehicleBusinessTrips.actions"),
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const id = params.row.id;

        return (
          <RowActions
            onEdit={() => navigate(`${id}/edit`)}
            labels={{
              edit: t("vehicleBusinessTrips.table.edit"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [vehicleBusinessTripsColumns, can, navigate, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) {
    return <div>{t("vehicleBusinessTrips.list.error")}</div>;
  }

  return (
    <PermissionGate guard={{ permission: "Permission.Vehicles.Update" }}>
      <ReusableDataGrid<VehicleBusinessTrip>
        rows={vehicleBusinessTripsRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </PermissionGate>
  );
}
