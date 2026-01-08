import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

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
import { useCancelVehicleBusinessTrip } from "../../hooks/useCancelBusinessTrip";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
};

export default function CancelBusinessTripDialog({
  open,
  onClose,
  trip,
}: Props) {
  const theme = useTheme();
  const CANCELLER_ID = "21";

  const cancelMutation = useCancelVehicleBusinessTrip();
  const submitting = cancelMutation.isPending;

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

  const cancelDisabled = submitting || !tripId;

  const handleCancelTrip = () => {
    if (cancelDisabled) return;

    cancelMutation.mutate(
      {
        tripId,
        cancelReason: trimmedReason,
        cancelledByEmployeeUserId: CANCELLER_ID,
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
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.main,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.18)}`,
            }}
          >
            <CancelOutlinedIcon sx={{ fontSize: 18 }} />
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
              Cancel business trip
            </DialogTitle>

            <Typography sx={{ fontSize: 12.5, color: "#6B7280", mt: 0.25 }}>
              {tripId ? `Trip #${tripId}` : "No trip selected"} · Canceller{" "}
              {CANCELLER_ID}
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
            "&:hover": {
              backgroundColor: alpha(theme.palette.warning.main, 0.08),
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, mb: 2 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 1,
              backgroundColor: "#ffffff",
              p: 1.75,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              Optional cancellation reason
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#6B7280", mt: 0.25 }}>
              This trip will be cancelled and removed from the approval flow.
            </Typography>

            <Box sx={{ height: 1, backgroundColor: "#E5E7EB", my: 1.5 }} />

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
              }}
            />
          </Box>

          {/* Warning */}
          <Box
            sx={{
              p: 1.25,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.16)}`,
            }}
          >
            <Typography sx={{ fontSize: 12.5 }}>
              ⚠️ This action cannot be undone.
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
        >
          Close
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={handleCancelTrip}
          disabled={cancelDisabled}
          size="small"
        >
          {submitting ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} />
              Cancelling…
            </Box>
          ) : (
            "Cancel trip"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
