import * as React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

import type { VehicleBusinessTrip } from "../..";
import { useVehicleOptions } from "../../../constants/options/useVehicleOptions";
import { useApproveVehicleBusinessTrip } from "../../hooks/useApproveVehicleBusinessTrip";
import { useIsVehicleAvailable } from "../../hooks/useIsVehicleAvailable";
import {
  AssignTaskDialog,
  type AssignTaskPreviewField,
} from "../../../../components/ui/assign-dialog/AssignTaskDialog";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
  approverEmployeeUserId: number | null;
};

export default function ApproveBusinessTripDialog({
  open,
  onClose,
  trip,
  approverEmployeeUserId,
}: Props) {
  const { options, isLoading: vehiclesLoading } = useVehicleOptions();
  const approveMutation = useApproveVehicleBusinessTrip();

  const [vehicleId, setVehicleId] = React.useState<number | "">("");
  const [vehicleIdForCheck, setVehicleIdForCheck] = React.useState<number>(0);

  React.useEffect(() => {
    if (!open) return;
    setVehicleId("");
    setVehicleIdForCheck(0);
  }, [open, trip?.id]);

  const startAt = (trip as any)?.startAt ?? (trip as any)?.fromDate ?? "";
  const endAt = (trip as any)?.endAt ?? (trip as any)?.toDate ?? "";
  const tripId = trip?.id ?? 0;

  const availability = useIsVehicleAvailable({
    vehicleId: vehicleIdForCheck,
    startAt,
    endAt,
    excludeTripId: trip?.id,
  });

  const submitting = approveMutation.isPending;

  const canCheck =
    typeof vehicleId === "number" && vehicleId > 0 && !!startAt && !!endAt;

  const handleCheckAvailability = () => {
    if (!canCheck) return;
    setVehicleIdForCheck(vehicleId as number);
  };

  const availabilityCheckedForSelectedVehicle =
    typeof vehicleId === "number" &&
    vehicleId > 0 &&
    vehicleIdForCheck > 0 &&
    vehicleIdForCheck === vehicleId;

  const vehicleAvailable =
    availability.isSuccess &&
    availabilityCheckedForSelectedVehicle &&
    availability.data === true;

  const approveDisabled =
    submitting ||
    vehiclesLoading ||
    !tripId ||
    !approverEmployeeUserId ||
    typeof vehicleId !== "number" ||
    vehicleId <= 0 ||
    availability.isFetching ||
    !availabilityCheckedForSelectedVehicle ||
    !vehicleAvailable;

  const approveTooltip = (() => {
    if (submitting) return "Submitting…";
    if (vehiclesLoading) return "Loading vehicles…";
    if (!tripId) return "No trip selected";
    if (!approverEmployeeUserId) return "Approver not available";
    if (typeof vehicleId !== "number" || vehicleId <= 0)
      return "Select a vehicle";
    if (availability.isFetching) return "Checking availability…";
    if (!availabilityCheckedForSelectedVehicle)
      return "Click “Check availability” first";
    if (!vehicleAvailable) return "Vehicle is not available";
    return "";
  })();

  const handleApprove = () => {
    if (!tripId) return;
    if (!approverEmployeeUserId) return;
    if (typeof vehicleId !== "number" || vehicleId <= 0) return;
    if (!vehicleAvailable) return;

    approveMutation.mutate(
      {
        tripId,
        vehicleId,
        approvedByEmployeeUserId: String(approverEmployeeUserId),
      },
      { onSuccess: onClose }
    );
  };

  const chipLabel = (() => {
    if (availability.isFetching) return "Checking availability…";
    if (availability.isSuccess && vehicleIdForCheck > 0)
      return availability.data ? "Vehicle available" : "Vehicle not available";
    return "Availability not checked";
  })();

  const dueTone: "warning" | "info" | "neutral" = (() => {
    if (availability.isFetching) return "info";
    if (availability.isSuccess && vehicleIdForCheck > 0) {
      return availability.data ? "info" : "warning";
    }
    return "neutral";
  })();

  const previewFields: AssignTaskPreviewField[] = [
    { label: "Start", value: startAt || "-", minWidth: 180 },
    { label: "End", value: endAt || "-", minWidth: 180 },
  ];

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
      title="Approve business trip"
      subtitle={
        approverEmployeeUserId
          ? `Approver ${approverEmployeeUserId}`
          : "Approver -"
      }
      headerIcon={<CheckCircleOutlineIcon sx={{ fontSize: 18 }} />}
      referenceText={tripId ? `Trip #${tripId}` : "No trip selected"}
      previewTitle="Trip details"
      previewSubtitle="Review the dates and then assign a vehicle."
      dueLabel={chipLabel}
      dueTone={dueTone}
      previewFields={previewFields}
      formLoading={vehiclesLoading}
      formDisabled={vehiclesLoading}
      submitting={submitting}
      submitText="Approve"
      cancelText="Cancel"
      onSubmit={handleApprove}
      submitDisabled={approveDisabled}
      submitVariant="primary"
    >
      <Box>
        <Typography
          sx={{ fontSize: 13, fontWeight: 700, color: "#111827", mb: 1.25 }}
        >
          Vehicle assignment
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            alignItems: "stretch",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <FormControl
            fullWidth
            size="small"
            disabled={vehiclesLoading || submitting}
          >
            <InputLabel id="approve-trip-vehicle-label">Vehicle</InputLabel>
            <Select
              labelId="approve-trip-vehicle-label"
              value={vehicleId}
              label="Vehicle"
              onChange={(e) => {
                const next = e.target.value as number | "";
                setVehicleId(next);
                setVehicleIdForCheck(0);
              }}
            >
              <MenuItem value="">
                <em>Select vehicle…</em>
              </MenuItem>
              {options.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip
            title={!canCheck ? "Select a vehicle and ensure dates exist" : ""}
          >
            <span>
              <Button
                onClick={handleCheckAvailability}
                disabled={!canCheck || availability.isFetching || submitting}
                size="small"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  px: 2.25,
                  height: 40,
                  minHeight: 40,
                  whiteSpace: "nowrap",
                }}
              >
                {availability.isFetching ? (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={16} />
                    Checking…
                  </Box>
                ) : (
                  "Check availability"
                )}
              </Button>
            </span>
          </Tooltip>
        </Box>

        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.25,
            borderRadius: 1,
            backgroundColor: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.14)",
          }}
        >
          <EventOutlinedIcon sx={{ fontSize: 16, opacity: 0.75 }} />
          <Typography sx={{ fontSize: 12.5, color: "#111827" }}>
            Tip: Use “Check availability” before approving to avoid conflicts.
          </Typography>
        </Box>

        {approveDisabled && approveTooltip ? (
          <Box sx={{ mt: 0.75 }}>
            <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
              {approveTooltip}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </AssignTaskDialog>
  );
}
