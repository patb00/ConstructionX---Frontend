import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import {
  alpha,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import type { VehicleBusinessTrip } from "../..";
import { useVehicleOptions } from "../../../constants/options/useVehicleOptions";
import { useApproveVehicleBusinessTrip } from "../../hooks/useApproveVehicleBusinessTrip";
import { useIsVehicleAvailable } from "../../hooks/useIsVehicleAvailable";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
};

export default function ApproveBusinessTripDialog({
  open,
  onClose,
  trip,
}: Props) {
  const theme = useTheme();
  const APPROVER_ID = "21";

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

  const handleDialogClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleExplicitClose = () => {
    if (submitting) return;
    onClose();
  };

  const canCheck =
    typeof vehicleId === "number" && vehicleId > 0 && !!startAt && !!endAt;

  const handleCheckAvailability = () => {
    if (!canCheck) return;
    setVehicleIdForCheck(vehicleId as number);
  };

  const handleApprove = () => {
    if (!tripId || typeof vehicleId !== "number" || vehicleId <= 0) return;

    if (!vehicleAvailable) return;

    approveMutation.mutate(
      {
        tripId,
        vehicleId,
        approvedByEmployeeUserId: APPROVER_ID,
      },
      { onSuccess: onClose }
    );
  };

  const chipStyles = (() => {
    if (availability.isFetching) {
      return {
        backgroundColor: alpha(theme.palette.info.main, 0.08),
        color: theme.palette.info.dark,
        border: `1px solid ${alpha(theme.palette.info.main, 0.14)}`,
        "& .MuiChip-icon": { color: theme.palette.info.dark },
      };
    }
    if (availability.isSuccess && vehicleIdForCheck > 0) {
      return availability.data
        ? {
            backgroundColor: alpha(theme.palette.success.main, 0.12),
            color: theme.palette.success.dark,
            border: `1px solid ${alpha(theme.palette.success.main, 0.18)}`,
            "& .MuiChip-icon": { color: theme.palette.success.dark },
          }
        : {
            backgroundColor: alpha(theme.palette.warning.main, 0.12),
            color: theme.palette.warning.dark,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.18)}`,
            "& .MuiChip-icon": { color: theme.palette.warning.dark },
          };
    }
    return {
      backgroundColor: "#F3F4F6",
      color: "#111827",
      border: "1px solid #E5E7EB",
      "& .MuiChip-icon": { color: "#111827" },
    };
  })();

  const chipLabel = (() => {
    if (availability.isFetching) return "Checking availability…";
    if (availability.isSuccess && vehicleIdForCheck > 0)
      return availability.data ? "Vehicle available" : "Vehicle not available";
    return "Availability not checked";
  })();

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
    typeof vehicleId !== "number" ||
    vehicleId <= 0 ||
    availability.isFetching ||
    !availabilityCheckedForSelectedVehicle ||
    !vehicleAvailable;

  const approveTooltip = (() => {
    if (submitting) return "Submitting…";
    if (vehiclesLoading) return "Loading vehicles…";
    if (!tripId) return "No trip selected";
    if (typeof vehicleId !== "number" || vehicleId <= 0)
      return "Select a vehicle";
    if (availability.isFetching) return "Checking availability…";
    if (!availabilityCheckedForSelectedVehicle)
      return "Click “Check availability” first";
    if (!vehicleAvailable) return "Vehicle is not available";
    return "";
  })();

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
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
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
              Approve business trip
            </DialogTitle>

            <Typography sx={{ fontSize: 12.5, color: "#6B7280", mt: 0.25 }}>
              {tripId ? `Trip #${tripId}` : "No trip selected"} · Approver{" "}
              {APPROVER_ID}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
              "&:hover": { backgroundColor: "#EFF6FF" },
            }}
          >
            <CloseIcon sx={{ fontSize: 16, color: "#111827" }} />
          </IconButton>
        </Box>
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
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}
                >
                  Trip details
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#6B7280", mt: 0.25 }}>
                  Review the dates and then assign a vehicle.
                </Typography>
              </Box>

              <Chip
                size="small"
                icon={<EventOutlinedIcon />}
                label={chipLabel}
                sx={{
                  height: 26,
                  fontSize: 12,
                  borderRadius: 999,
                  ...chipStyles,
                }}
              />
            </Box>

            <Box sx={{ height: 1, backgroundColor: "#E5E7EB", my: 1.5 }} />

            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              <Box sx={{ minWidth: 180 }}>
                <Typography sx={{ fontSize: 11.5, color: "#6B7280" }}>
                  Start
                </Typography>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                >
                  {startAt || "-"}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 180 }}>
                <Typography sx={{ fontSize: 11.5, color: "#6B7280" }}>
                  End
                </Typography>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                >
                  {endAt || "-"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 1,
              backgroundColor: "#ffffff",
              p: 1.75,
            }}
          >
            <Stack spacing={2}>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}
              >
                Vehicle assignment
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <FormControl
                  fullWidth
                  size="small"
                  disabled={vehiclesLoading || submitting}
                >
                  <InputLabel id="approve-trip-vehicle-label">
                    Vehicle
                  </InputLabel>
                  <Select
                    labelId="approve-trip-vehicle-label"
                    value={vehicleId}
                    label="Vehicle"
                    onChange={(e) => {
                      const next = e.target.value as number | "";
                      setVehicleId(next);
                      setVehicleIdForCheck(0); // reset "checked"
                    }}
                    sx={{
                      borderRadius: 1,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      backgroundColor: "#fff",
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
                  title={
                    !canCheck ? "Select a vehicle and ensure dates exist" : ""
                  }
                >
                  <span>
                    <Button
                      onClick={handleCheckAvailability}
                      disabled={
                        !canCheck || availability.isFetching || submitting
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        px: 2.25,
                        height: 40,
                        minHeight: 40,
                        alignSelf: "stretch",
                        borderColor: "#E5E7EB",
                        color: "#111827",
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                        whiteSpace: "nowrap",
                        "&:hover": {
                          backgroundColor: "#F9FAFB",
                          borderColor: "#D1D5DB",
                        },
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
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.25,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.info.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.14)}`,
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "#111827" }}>
                  Tip: Use “Check availability” before approving to avoid
                  conflicts.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

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

        <Tooltip title={approveDisabled ? approveTooltip : ""}>
          <span>
            <Button
              variant="contained"
              onClick={handleApprove}
              disabled={approveDisabled}
              size="small"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                backgroundColor: theme.palette.primary.main,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              {submitting ? (
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <CircularProgress size={16} />
                  Approving…
                </Box>
              ) : (
                "Approve"
              )}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
