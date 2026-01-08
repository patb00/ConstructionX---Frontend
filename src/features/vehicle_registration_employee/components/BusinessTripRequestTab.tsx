import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { PermissionGate, useCan } from "../../../lib/permissions";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";

import ListView, {
  type ListViewColumn,
  type ListViewSection,
} from "../../../components/ui/views/ListView";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ApproveBusinessTripDialog from "../../vehicle_business_trips/components/dialogs/ApproveBusinessTripDialog";
import RejectBusinessTripDialog from "../../vehicle_business_trips/components/dialogs/RejectBusinessTripDialog";
import CancelBusinessTripDialog from "../../vehicle_business_trips/components/dialogs/CancelBusinesssTripDialog";
import { useVehicleBusinessTrips } from "../../vehicle_business_trips/hooks/useVehicleBusinessTrips";

// adapt if you already export this type
type VehicleBusinessTripRow = {
  id: number;
  employeeId: number | null;
  vehicleId: number | null;
  startLocationText: string | null;
  endLocationText: string | null;
  purposeOfTrip: string | null;
  startAt: string | null;
  endAt: string | null;
  tripStatus: number;
};

const TripStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Completed: 3,
  InProgress: 4,
  Cancelled: 5,
} as const;

function statusTitle(t: any, status: number) {
  switch (status) {
    case TripStatus.Pending:
      return t("tripStatus.pending", "Pending");
    case TripStatus.Approved:
      return t("tripStatus.approved", "Approved");
    case TripStatus.Rejected:
      return t("tripStatus.rejected", "Rejected");
    case TripStatus.Completed:
      return t("tripStatus.completed", "Completed");
    case TripStatus.InProgress:
      return t("tripStatus.inProgress", "In progress");
    case TripStatus.Cancelled:
      return t("tripStatus.cancelled", "Cancelled");
    default:
      return t("tripStatus.unknown", "Unknown");
  }
}

export default function BusinessTripRequestsTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();
  const { role, userId } = useAuthStore();
  const isAdmin = role === "Admin";

  const { employeeRows = [] } = useEmployees();

  const { vehicleBusinessTripsRows = [] } = useVehicleBusinessTrips() as {
    vehicleBusinessTripsRows: VehicleBusinessTripRow[];
  };

  const myEmployeeId = useMemo<number | null>(() => {
    if (!userId) return null;
    const me = employeeRows.find((e: any) => e.applicationUserId === userId);
    return me?.id ?? null;
  }, [employeeRows, userId]);

  const rows = useMemo(() => {
    if (isAdmin) return vehicleBusinessTripsRows;
    if (myEmployeeId == null) return [];
    return vehicleBusinessTripsRows.filter(
      (r) => r.employeeId === myEmployeeId
    );
  }, [vehicleBusinessTripsRows, isAdmin, myEmployeeId]);

  // dialogs state (reuse your existing dialogs)
  const [selectedTrip, setSelectedTrip] =
    useState<VehicleBusinessTripRow | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const closeAll = useCallback(() => {
    setApproveOpen(false);
    setRejectOpen(false);
    setCancelOpen(false);
    setSelectedTrip(null);
  }, []);

  const openApprove = useCallback((trip: VehicleBusinessTripRow) => {
    setSelectedTrip(trip);
    setApproveOpen(true);
  }, []);

  const openReject = useCallback((trip: VehicleBusinessTripRow) => {
    setSelectedTrip(trip);
    setRejectOpen(true);
  }, []);

  const openCancel = useCallback((trip: VehicleBusinessTripRow) => {
    setSelectedTrip(trip);
    setCancelOpen(true);
  }, []);

  const sections: Array<ListViewSection<VehicleBusinessTripRow>> =
    useMemo(() => {
      const order = [
        TripStatus.Pending,
        TripStatus.Approved,
        TripStatus.InProgress,
        TripStatus.Completed,
        TripStatus.Rejected,
        TripStatus.Cancelled,
      ];

      return order
        .map((status) => ({
          key: `status-${status}`,
          title: statusTitle(t, status),
          items: rows.filter((r) => (r.tripStatus ?? -1) === status),
        }))
        .filter((s) => s.items.length > 0);
    }, [rows, t]);

  const canUpdate = can({ permission: "Permission.Vehicles.Update" }); // same as your table used
  const showActions = isAdmin && canUpdate;

  const columns: Array<ListViewColumn<VehicleBusinessTripRow>> = useMemo(() => {
    const base: Array<ListViewColumn<VehicleBusinessTripRow>> = [
      {
        key: "date",
        header: t("vehicleBusinessTrips.fields.dates", "Dates"),
        width: 260,
        render: (row) =>
          [row.startAt, row.endAt].filter(Boolean).join(" → ") || "—",
      },
      {
        key: "route",
        header: t("vehicleBusinessTrips.fields.route", "Route"),
        width: 360,
        render: (row) =>
          [row.startLocationText, row.endLocationText]
            .filter(Boolean)
            .join(" → ") || "—",
      },
      {
        key: "purpose",
        header: t("vehicleBusinessTrips.fields.purpose", "Purpose"),
        hideBelow: "md",
        render: (row) => row.purposeOfTrip || "—",
      },
      {
        key: "vehicle",
        header: t("vehicleBusinessTrips.fields.vehicle", "Vehicle"),
        width: 120,
        hideBelow: "md",
        render: (row) => (row.vehicleId != null ? `#${row.vehicleId}` : "—"),
      },
    ];

    if (!showActions) return base;

    return [
      ...base,
      {
        key: "actions",
        header: t("vehicleBusinessTrips.actions", "Actions"),
        width: 220,
        render: (row) => (
          <RowActions
            onEdit={() =>
              navigate(`/app/vehicle-business-trips/${row.id}/edit`)
            }
            labels={{ edit: t("vehicleBusinessTrips.table.edit", "Edit") }}
            customActions={[
              {
                key: "approve",
                label: t("vehicleBusinessTrips.table.approve", "Approve"),
                icon: <CheckIcon sx={{ fontSize: 16 }} />,
                onClick: () => openApprove(row),
                variant: "success",
              },
              {
                key: "reject",
                label: t("vehicleBusinessTrips.table.reject", "Reject"),
                icon: <CloseIcon sx={{ fontSize: 16 }} />,
                onClick: () => openReject(row),
                variant: "danger",
              },
              {
                key: "cancel",
                label: t("vehicleBusinessTrips.table.cancel", "Cancel"),
                icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} />,
                onClick: () => openCancel(row),
                variant: "danger",
              },
            ]}
          />
        ),
      },
    ];
  }, [navigate, openApprove, openReject, openCancel, showActions, t]);

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight={600}>
          {t("vehicleBusinessTrips.list.title", "Business Trip Requests")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Vehicles.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="/app/vehicle-business-trips/create"
            variant="contained"
          >
            {t("vehicleBusinessTrips.create.title", "Create")}
          </Button>
        </PermissionGate>
      </Stack>

      <Box sx={{ width: "100%" }}>
        <ListView<VehicleBusinessTripRow>
          sections={sections}
          getRowKey={(r) => String(r.id)}
          columns={columns}
          enableHorizontalScroll
          tableMinWidth={showActions ? 1100 : 900}
        />
      </Box>

      {/* dialogs */}
      <ApproveBusinessTripDialog
        open={approveOpen}
        trip={selectedTrip as any}
        onClose={closeAll}
      />
      <RejectBusinessTripDialog
        open={rejectOpen}
        trip={selectedTrip as any}
        onClose={closeAll}
      />
      <CancelBusinessTripDialog
        open={cancelOpen}
        trip={selectedTrip as any}
        onClose={closeAll}
      />
    </Stack>
  );
}
