import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
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
import { useTranslation } from "react-i18next";

import type { VehicleBusinessTrip } from "../..";
import { useVehicleOptions } from "../../../constants/options/useVehicleOptions";
import { useApproveVehicleBusinessTrip } from "../../hooks/useApproveVehicleBusinessTrip";
import { useIsVehicleAvailable } from "../../hooks/useIsVehicleAvailable";
import {
  AssignTaskDialog,
  type AssignTaskPreviewField,
} from "../../../../components/ui/assign-dialog/AssignTaskDialog";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
  approverEmployeeUserId: number | null;
  onExited?: () => void;
};

export default function ApproveBusinessTripDialog({
  open,
  onClose,
  trip,
  approverEmployeeUserId,
  onExited,
}: Props) {
  const { t } = useTranslation();
  const { options, isLoading: vehiclesLoading } = useVehicleOptions();
  const approveMutation = useApproveVehicleBusinessTrip();

  const [vehicleId, setVehicleId] = useState<number | "">("");
  const [vehicleIdForCheck, setVehicleIdForCheck] = useState<number>(0);

  useEffect(() => {
    if (open) {
      setVehicleId("");
      setVehicleIdForCheck(0);
    }
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
    if (submitting)
      return t("vehicleBusinessTrips.dialogs.approve.tooltip.submitting");
    if (vehiclesLoading)
      return t("vehicleBusinessTrips.dialogs.approve.tooltip.loadingVehicles");
    if (!tripId) return t("vehicleBusinessTrips.dialogs.common.noTripSelected");
    if (!approverEmployeeUserId)
      return t("vehicleBusinessTrips.dialogs.approve.tooltip.noApprover");
    if (typeof vehicleId !== "number" || vehicleId <= 0)
      return t("vehicleBusinessTrips.dialogs.approve.tooltip.selectVehicle");
    if (availability.isFetching)
      return t(
        "vehicleBusinessTrips.dialogs.approve.tooltip.checkingAvailability"
      );
    if (!availabilityCheckedForSelectedVehicle)
      return t("vehicleBusinessTrips.dialogs.approve.tooltip.clickCheckFirst");
    if (!vehicleAvailable)
      return t(
        "vehicleBusinessTrips.dialogs.approve.tooltip.vehicleNotAvailable"
      );
    return "";
  })();

  const handleApprove = () => {
    if (!tripId || !approverEmployeeUserId || typeof vehicleId !== "number")
      return;
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
    if (availability.isFetching)
      return t("vehicleBusinessTrips.dialogs.approve.chip.checking");
    if (availability.isSuccess && vehicleIdForCheck > 0)
      return availability.data
        ? t("vehicleBusinessTrips.dialogs.approve.chip.available")
        : t("vehicleBusinessTrips.dialogs.approve.chip.notAvailable");
    return t("vehicleBusinessTrips.dialogs.approve.chip.notChecked");
  })();

  const previewFields: AssignTaskPreviewField[] = [
    {
      label: t("vehicleBusinessTrips.dialogs.common.start"),
      value: startAt || "-",
      minWidth: 180,
    },
    {
      label: t("vehicleBusinessTrips.dialogs.common.end"),
      value: endAt || "-",
      minWidth: 180,
    },
  ];

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
      onExited={() => {
        setVehicleId("");
        setVehicleIdForCheck(0);
        onExited?.();
      }}
      title={t("vehicleBusinessTrips.dialogs.approve.title")}
      subtitle={
        approverEmployeeUserId
          ? t("vehicleBusinessTrips.dialogs.approve.subtitle", {
              id: approverEmployeeUserId,
            })
          : t("vehicleBusinessTrips.dialogs.approve.subtitle", { id: "-" })
      }
      headerIcon={<ThumbUpAltOutlinedIcon sx={{ fontSize: 18 }} />}
      referenceText={
        tripId
          ? t("vehicleBusinessTrips.dialogs.common.referenceTrip", {
              id: tripId,
            })
          : t("vehicleBusinessTrips.dialogs.common.noTripSelected")
      }
      previewTitle={t("vehicleBusinessTrips.dialogs.common.tripDetailsTitle")}
      previewSubtitle={t(
        "vehicleBusinessTrips.dialogs.approve.previewSubtitle"
      )}
      dueLabel={chipLabel}
      previewFields={previewFields}
      formLoading={vehiclesLoading}
      formDisabled={vehiclesLoading}
      submitting={submitting}
      submitText={t("vehicleBusinessTrips.dialogs.approve.submit")}
      cancelText={t("vehicleBusinessTrips.dialogs.common.cancel")}
      onSubmit={handleApprove}
      submitDisabled={approveDisabled}
      submitVariant="primary"
    >
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1.25 }}>
          {t("vehicleBusinessTrips.dialogs.approve.vehicleAssignment")}
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
            <InputLabel id="approve-trip-vehicle-label">
              {t("vehicleBusinessTrips.dialogs.approve.vehicleLabel")}
            </InputLabel>

            <Select
              labelId="approve-trip-vehicle-label"
              value={vehicleId}
              label={t("vehicleBusinessTrips.dialogs.approve.vehicleLabel")}
              onChange={(e) => {
                const next = e.target.value as number | "";
                setVehicleId(next);
                setVehicleIdForCheck(0);
              }}
            >
              <MenuItem value="">
                <em>
                  {t("vehicleBusinessTrips.dialogs.approve.selectVehicle")}
                </em>
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
              !canCheck
                ? t(
                    "vehicleBusinessTrips.dialogs.approve.tooltip.selectVehicleAndDates"
                  )
                : ""
            }
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
                    {t("vehicleBusinessTrips.dialogs.approve.checking")}
                  </Box>
                ) : (
                  t("vehicleBusinessTrips.dialogs.approve.checkAvailability")
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
            {t("vehicleBusinessTrips.dialogs.approve.tip")}
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
