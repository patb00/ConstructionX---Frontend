import { useMemo, useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import { PermissionGate, useCan } from "../../../lib/permissions";
import type { VehicleBusinessTrip } from "..";

import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

import { useAuthStore } from "../../auth/store/useAuthStore";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";

import { useVehicleBusinessTrips } from "../hooks/useVehicleBusinessTrips";

import ApproveBusinessTripDialog from "./dialogs/ApproveBusinessTripDialog";
import RejectBusinessTripDialog from "./dialogs/RejectBusinessTripDialog";
import CancelBusinessTripDialog from "./dialogs/CancelBusinesssTripDialog";
import { useVehicleBusinessTripsByEmployee } from "../hooks/useVehicleBusinessTripsByEmployee";

export default function VehicleBusinessTripsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();

  const { userId, role } = useAuthStore();
  const isAdmin = role === "Admin";

  const { employeeRows = [] } = useEmployees();
  const myEmployeeId = useMemo<number | null>(() => {
    if (!userId) return null;
    const me = employeeRows.find((e: any) => e.applicationUserId === userId);
    return me?.id ?? null;
  }, [employeeRows, userId]);

  const adminTrips = useVehicleBusinessTrips();
  const employeeTrips = useVehicleBusinessTripsByEmployee(myEmployeeId ?? 0);
  const vehicleBusinessTripsRows = isAdmin
    ? adminTrips.vehicleBusinessTripsRows
    : employeeTrips.vehicleBusinessTripsRows;

  const vehicleBusinessTripsColumns = isAdmin
    ? adminTrips.vehicleBusinessTripsColumns
    : employeeTrips.vehicleBusinessTripsColumns;

  const total = isAdmin ? adminTrips.total : employeeTrips.total;

  const error = isAdmin ? adminTrips.error : employeeTrips.error;
  const isLoading = isAdmin ? adminTrips.isLoading : employeeTrips.isLoading;

  const paginationModel = isAdmin ? adminTrips.paginationModel : undefined;
  const setPaginationModel = isAdmin
    ? adminTrips.setPaginationModel
    : undefined;

  const [selectedTrip, setSelectedTrip] = useState<VehicleBusinessTrip | null>(
    null
  );
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const openApprove = (trip: VehicleBusinessTrip) => {
    setSelectedTrip(trip);
    setApproveOpen(true);
  };

  const openReject = (trip: VehicleBusinessTrip) => {
    setSelectedTrip(trip);
    setRejectOpen(true);
  };

  const openCancel = (trip: VehicleBusinessTrip) => {
    setSelectedTrip(trip);
    setCancelOpen(true);
  };

  const closeAll = () => {
    setApproveOpen(false);
    setRejectOpen(false);
    setCancelOpen(false);
    setSelectedTrip(null);
  };

  const columnsWithActions = useMemo<GridColDef<VehicleBusinessTrip>[]>(() => {
    const base = vehicleBusinessTripsColumns.slice();
    const canEdit = can({ permission: "Permission.Vehicles.Update" });

    if (!canEdit) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<VehicleBusinessTrip> = {
      field: "actions",
      headerName: t("vehicleBusinessTrips.actions"),
      width: 200,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = row.id;

        return (
          <RowActions
            onEdit={() => navigate(`${id}/edit`)}
            labels={{ edit: t("vehicleBusinessTrips.table.edit") }}
            customActions={[
              {
                key: "approve",
                label: t("vehicleBusinessTrips.table.approve") ?? "Approve",
                icon: <CheckIcon sx={{ fontSize: 16 }} />,
                onClick: () => openApprove(row),
                variant: "success",
              },
              {
                key: "reject",
                label: t("vehicleBusinessTrips.table.reject") ?? "Reject",
                icon: <CloseIcon sx={{ fontSize: 16 }} />,
                onClick: () => openReject(row),
                variant: "danger",
              },
              {
                key: "cancel",
                label: t("vehicleBusinessTrips.table.cancel") ?? "Cancel",
                icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} />,
                onClick: () => openCancel(row),
                variant: "danger",
              },
            ]}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [vehicleBusinessTripsColumns, can, navigate, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>{t("vehicleBusinessTrips.list.error")}</div>;

  return (
    <PermissionGate guard={{ permission: "Permission.Vehicles.Update" }}>
      <>
        <ReusableDataGrid<VehicleBusinessTrip>
          rows={vehicleBusinessTripsRows}
          columns={columnsWithActions}
          getRowId={(r) => r.id}
          pinnedRightField={hasActions ? "actions" : undefined}
          loading={!!isLoading}
          paginationMode={isAdmin ? "server" : "client"}
          rowCount={total}
          {...(isAdmin
            ? {
                paginationModel,
                onPaginationModelChange: setPaginationModel,
              }
            : {})}
        />

        <ApproveBusinessTripDialog
          open={approveOpen}
          trip={selectedTrip}
          onClose={closeAll}
        />
        <RejectBusinessTripDialog
          open={rejectOpen}
          trip={selectedTrip}
          onClose={closeAll}
        />
        <CancelBusinessTripDialog
          open={cancelOpen}
          trip={selectedTrip}
          onClose={closeAll}
        />
      </>
    </PermissionGate>
  );
}
