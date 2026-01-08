import * as React from "react";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { Box, TextField, Typography } from "@mui/material";
import type { VehicleBusinessTrip } from "../..";
import { useRejectVehicleBusinessTrip } from "../../hooks/useRejectVehicleBusinessTrip";
import { AssignTaskDialog } from "../../../../components/ui/assign-dialog/AssignTaskDialog";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
  rejectorEmployeeUserId: number | null;
};

export default function RejectBusinessTripDialog({
  open,
  onClose,
  trip,
  rejectorEmployeeUserId,
}: Props) {
  const rejectMutation = useRejectVehicleBusinessTrip();
  const submitting = rejectMutation.isPending;

  const tripId = trip?.id ?? 0;

  const startAt = (trip as any)?.startAt ?? (trip as any)?.fromDate ?? "";
  const endAt = (trip as any)?.endAt ?? (trip as any)?.toDate ?? "";

  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setReason("");
  }, [open, trip?.id]);

  const trimmedReason = reason.trim();

  const rejectDisabled =
    submitting ||
    !tripId ||
    !rejectorEmployeeUserId ||
    trimmedReason.length < 3;

  const handleReject = () => {
    if (rejectDisabled) return;

    rejectMutation.mutate(
      {
        tripId,
        rejectReason: trimmedReason,
        approvedByEmployeeUserId: String(rejectorEmployeeUserId),
      },
      { onSuccess: onClose }
    );
  };

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
      title="Reject business trip"
      subtitle={
        rejectorEmployeeUserId
          ? `Rejector ${rejectorEmployeeUserId}`
          : "Rejector -"
      }
      headerIcon={<ThumbDownAltOutlinedIcon sx={{ fontSize: 18 }} />}
      referenceText={tripId ? `Trip #${tripId}` : "No trip selected"}
      previewTitle="Trip details"
      previewSubtitle="Review the dates and provide a reason for rejection."
      dueTone="neutral"
      previewFields={[
        { label: "Start", value: startAt || "-", minWidth: 180 },
        { label: "End", value: endAt || "-", minWidth: 180 },
      ]}
      submitText="Reject"
      cancelText="Cancel"
      onSubmit={handleReject}
      submitting={submitting}
      submitDisabled={rejectDisabled}
      submitVariant="danger"
    >
      <Box>
        <Typography sx={{ fontSize: 12.5, color: "#6B7280", mb: 1.25 }}>
          Please provide a short reason. This will be saved with the trip.
        </Typography>

        <TextField
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          disabled={submitting}
          placeholder="e.g. Dates conflict / Missing info / Policy reason…"
          size="small"
          helperText={
            trimmedReason.length > 0 && trimmedReason.length < 3
              ? "Please enter at least 3 characters."
              : " "
          }
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
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.25,
            borderRadius: 1,
            backgroundColor: "rgba(245,158,11,0.10)",
            border: "1px solid rgba(245,158,11,0.16)",
          }}
        >
          <Typography sx={{ fontSize: 12.5, color: "#111827" }}>
            Note: Rejecting will notify the requester and stop the approval
            flow.
          </Typography>
        </Box>
      </Box>
    </AssignTaskDialog>
  );
}
