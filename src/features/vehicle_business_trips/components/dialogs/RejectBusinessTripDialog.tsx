import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";

import type { VehicleBusinessTrip } from "../..";
import { useRejectVehicleBusinessTrip } from "../../hooks/useRejectVehicleBusinessTrip";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
};

export default function RejectBusinessTripDialog({
  open,
  onClose,
  trip,
}: Props) {
  const theme = useTheme();
  const REJECTOR_ID = "21"; // same as approver id in your example (rename as needed)

  const rejectMutation = useRejectVehicleBusinessTrip();
  const submitting = rejectMutation.isPending;

  const tripId = trip?.id ?? 0;

  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setReason("");
  }, [open, trip?.id]);

  const handleDialogClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleExplicitClose = () => {
    if (submitting) return;
    onClose();
  };

  const trimmedReason = reason.trim();
  const rejectDisabled = submitting || !tripId || trimmedReason.length < 3;

  const handleReject = () => {
    if (rejectDisabled) return;

    rejectMutation.mutate(
      {
        tripId,
        rejectReason: trimmedReason,
        approvedByEmployeeUserId: REJECTOR_ID, // your API expects this field name
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      keepMounted
      PaperProps={{
        sx: {
          position: "relative",
          p: 2.5,
          pt: 2.25,
          pb: 2.5,
          backgroundColor: "#ffffff",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              display: "grid",
              placeItems: "center",
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              border: `1px solid ${alpha(theme.palette.error.main, 0.18)}`,
            }}
          >
            <HighlightOffIcon sx={{ fontSize: 18 }} />
          </Box>

          <Box>
            <DialogTitle
              sx={{
                m: 0,
                p: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Reject business trip
            </DialogTitle>

            <Typography sx={{ fontSize: 12.5, color: "#6B7280", mt: 0.25 }}>
              {tripId ? `Trip #${tripId}` : "No trip selected"} · Rejector{" "}
              {REJECTOR_ID}
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={handleExplicitClose}
          disabled={submitting}
          sx={{
            width: 32,
            height: 32,
            borderRadius: "999px",
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 16, color: "#111827" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, mb: 2 }}>
        <Stack spacing={2}>
          {/* Info / Preview */}
          <Box
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 1,
              backgroundColor: "#ffffff",
              p: 1.75,
            }}
          >
            <Typography
              sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}
            >
              Reason for rejection
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#6B7280", mt: 0.25 }}>
              Please provide a short reason. This will be saved with the trip.
            </Typography>

            <Box sx={{ height: 1, backgroundColor: "#E5E7EB", my: 1.5 }} />

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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  backgroundColor: "#fff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E5E7EB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D1D5DB",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: alpha(theme.palette.error.main, 0.5),
                  },
              }}
              helperText={
                trimmedReason.length > 0 && trimmedReason.length < 3
                  ? "Please enter at least 3 characters."
                  : " "
              }
            />
          </Box>

          {/* Optional warning box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.25,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.16)}`,
            }}
          >
            <Typography sx={{ fontSize: 12.5, color: "#111827" }}>
              Note: Rejecting will notify the requester and stop the approval
              flow.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          p: 0,
          mt: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          onClick={handleExplicitClose}
          disabled={submitting}
          size="small"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 500,
            px: 2.5,
            borderColor: "#E5E7EB",
            color: "#111827",
            backgroundColor: "#ffffff",
            "&:hover": { backgroundColor: "#F9FAFB", borderColor: "#D1D5DB" },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleReject}
          disabled={rejectDisabled}
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            backgroundColor: theme.palette.error.main,
            "&:hover": { backgroundColor: theme.palette.error.dark },
          }}
        >
          {submitting ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} />
              Rejecting…
            </Box>
          ) : (
            "Reject"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
