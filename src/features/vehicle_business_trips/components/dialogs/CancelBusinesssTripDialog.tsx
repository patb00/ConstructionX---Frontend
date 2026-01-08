import * as React from "react";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { Box, TextField, Typography } from "@mui/material";
import type { VehicleBusinessTrip } from "../..";
import { useCancelVehicleBusinessTrip } from "../../hooks/useCancelBusinessTrip";
import { AssignTaskDialog } from "../../../../components/ui/assign-dialog/AssignTaskDialog";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
  cancellerEmployeeUserId: number | null;
};

export default function CancelBusinessTripDialog({
  open,
  onClose,
  trip,
  cancellerEmployeeUserId,
}: Props) {
  const cancelMutation = useCancelVehicleBusinessTrip();
  const submitting = cancelMutation.isPending;

  const tripId = trip?.id ?? 0;

  const startAt = (trip as any)?.startAt ?? (trip as any)?.fromDate ?? "";
  const endAt = (trip as any)?.endAt ?? (trip as any)?.toDate ?? "";

  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setReason("");
  }, [open, trip?.id]);

  const trimmedReason = reason.trim();

  const cancelDisabled = submitting || !tripId || !cancellerEmployeeUserId;

  const cancelTooltip = (() => {
    if (submitting) return "Submitting…";
    if (!tripId) return "No trip selected";
    if (!cancellerEmployeeUserId) return "Canceller not available";
    return "";
  })();

  const handleCancelTrip = () => {
    if (cancelDisabled) return;

    cancelMutation.mutate(
      {
        tripId,
        cancelReason: trimmedReason,
        cancelledByEmployeeUserId: String(cancellerEmployeeUserId),
      },
      { onSuccess: onClose }
    );
  };

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
      title="Cancel business trip"
      subtitle={
        cancellerEmployeeUserId
          ? `Canceller ${cancellerEmployeeUserId}`
          : "Canceller -"
      }
      headerIcon={<BlockOutlinedIcon sx={{ fontSize: 18 }} />}
      referenceText={tripId ? `Trip #${tripId}` : "No trip selected"}
      previewTitle="Trip details"
      previewSubtitle="This trip will be cancelled and removed from the approval flow."
      dueTone="neutral"
      previewFields={[
        { label: "Start", value: startAt || "-", minWidth: 180 },
        { label: "End", value: endAt || "-", minWidth: 180 },
      ]}
      submitText="Cancel trip"
      cancelText="Close"
      onSubmit={handleCancelTrip}
      submitting={submitting}
      submitDisabled={cancelDisabled}
      submitVariant="danger"
    >
      <Box>
        <Typography sx={{ fontSize: 12.5, color: "#6B7280", mb: 1.25 }}>
          You can add a reason (optional). This action cannot be undone.
        </Typography>

        <TextField
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          disabled={submitting}
          placeholder="Optional reason (e.g. no longer needed)"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              backgroundColor: "#fff",
            },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D1D5DB",
            },
          }}
        />

        <Box
          sx={{
            mt: 1.25,
            p: 1.25,
            borderRadius: 1,
            backgroundColor: "rgba(245,158,11,0.10)",
            border: "1px solid rgba(245,158,11,0.16)",
          }}
        >
          <Typography sx={{ fontSize: 12.5, color: "#111827" }}>
            This action cannot be undone.
          </Typography>
        </Box>

        {cancelDisabled && cancelTooltip ? (
          <Box sx={{ mt: 0.75 }}>
            <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
              {cancelTooltip}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </AssignTaskDialog>
  );
}
