import { useMemo, useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { VehicleBusinessTrip } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { useCurrentEmployeeContext } from "../../auth/hooks/useCurrentEmployeeContext";
import { useVehicleBusinessTrips } from "../hooks/useVehicleBusinessTrips";
import { useVehicleBusinessTripsByEmployee } from "../hooks/useVehicleBusinessTripsByEmployee";
import ApproveBusinessTripDialog from "./dialogs/ApproveBusinessTripDialog";
import RejectBusinessTripDialog from "./dialogs/RejectBusinessTripDialog";
import CancelBusinessTripDialog from "./dialogs/CancelBusinesssTripDialog";
import CompleteBusinessTripDialog from "./dialogs/CompleteBusinessTripDialog";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

const TripStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Completed: 3,
  InProgress: 4,
  Cancelled: 5,
} as const;

const isTerminal = (s: number) =>
  s === TripStatus.Rejected ||
  s === TripStatus.Completed ||
  s === TripStatus.Cancelled;

const canComplete = (s: number) => s === TripStatus.Approved;

const canCancel = (s: number) => s !== TripStatus.Approved && !isTerminal(s);

export default function VehicleBusinessTripsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();

  const { isAdmin, employeeId } = useCurrentEmployeeContext();
  const myEmployeeId = employeeId;

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
  const [completeOpen, setCompleteOpen] = useState(false);

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

  const openComplete = (trip: VehicleBusinessTrip) => {
    setSelectedTrip(trip);
    setCompleteOpen(true);
  };

  const closeAll = () => {
    setApproveOpen(false);
    setRejectOpen(false);
    setCancelOpen(false);
    setCompleteOpen(false);
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
      width: 240,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = row.id;

        const status = (row.tripStatus as number) ?? TripStatus.Pending;

        const customActions = [
          ...(isAdmin
            ? [
                ...(status === TripStatus.Pending
                  ? [
                      {
                        key: "approve",
                        label:
                          t("vehicleBusinessTrips.table.approve") ?? "Approve",
                        icon: <ThumbUpAltOutlinedIcon sx={{ fontSize: 16 }} />,
                        onClick: () => openApprove(row),
                        variant: "success" as const,
                      },
                      {
                        key: "reject",
                        label:
                          t("vehicleBusinessTrips.table.reject") ?? "Reject",
                        icon: (
                          <ThumbDownAltOutlinedIcon sx={{ fontSize: 16 }} />
                        ),
                        onClick: () => openReject(row),
                        variant: "danger" as const,
                      },
                    ]
                  : []),
              ]
            : []),

          ...(canCancel(status)
            ? [
                {
                  key: "cancel",
                  label: t("vehicleBusinessTrips.table.cancel") ?? "Cancel",
                  icon: <BlockOutlinedIcon sx={{ fontSize: 16 }} />,
                  onClick: () => openCancel(row),
                  variant: "danger" as const,
                },
              ]
            : []),

          ...(canComplete(status)
            ? [
                {
                  key: "complete",
                  label: t("vehicleBusinessTrips.table.complete") ?? "Complete",
                  icon: <TaskAltOutlinedIcon sx={{ fontSize: 16 }} />,
                  onClick: () => openComplete(row),
                  variant: "success" as const,
                },
              ]
            : []),
        ];

        return (
          <RowActions
            onEdit={() => navigate(`${id}/edit`)}
            labels={{ edit: t("vehicleBusinessTrips.table.edit") }}
            customActions={customActions}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [vehicleBusinessTripsColumns, can, isAdmin, navigate, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>{t("vehicleBusinessTrips.list.error")}</div>;

  console.log("columnsWithActions", columnsWithActions);

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
          approverEmployeeUserId={employeeId ?? null}
        />

        <RejectBusinessTripDialog
          open={rejectOpen}
          trip={selectedTrip}
          onClose={closeAll}
          rejectorEmployeeUserId={employeeId ?? null}
        />

        <CancelBusinessTripDialog
          open={cancelOpen}
          trip={selectedTrip}
          onClose={closeAll}
          cancellerEmployeeUserId={employeeId ?? null}
        />

        <CompleteBusinessTripDialog
          open={completeOpen}
          trip={selectedTrip}
          onClose={closeAll}
        />
      </>
    </PermissionGate>
  );
}
