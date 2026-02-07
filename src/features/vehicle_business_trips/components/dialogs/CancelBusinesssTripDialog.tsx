import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { Box, TextField, Typography } from "@mui/material";
import type { VehicleBusinessTrip } from "../..";
import { useCancelVehicleBusinessTrip } from "../../hooks/useCancelBusinessTrip";
import { AssignTaskDialog } from "../../../../components/ui/assign-dialog/AssignTaskDialog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
  cancellerEmployeeUserId: number | null;
  onExited?: () => void;
};

export default function CancelBusinessTripDialog({
  open,
  onClose,
  trip,
  cancellerEmployeeUserId,
  onExited,
}: Props) {
  const { t } = useTranslation();
  const cancelMutation = useCancelVehicleBusinessTrip();
  const submitting = cancelMutation.isPending;

  const tripId = trip?.id ?? 0;

  const startAt = (trip as any)?.startAt ?? (trip as any)?.fromDate ?? "";
  const endAt = (trip as any)?.endAt ?? (trip as any)?.toDate ?? "";

  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open, trip?.id]);

  const trimmedReason = reason.trim();

  const cancelDisabled =
    submitting ||
    !tripId ||
    !cancellerEmployeeUserId ||
    trimmedReason.length < 3;

  const cancelTooltip = (() => {
    if (submitting)
      return t("vehicleBusinessTrips.dialogs.cancel.tooltip.submitting");
    if (!tripId) return t("vehicleBusinessTrips.dialogs.common.noTripSelected");
    if (!cancellerEmployeeUserId)
      return t("vehicleBusinessTrips.dialogs.cancel.tooltip.noCanceller");
    if (trimmedReason.length < 3)
      return t("vehicleBusinessTrips.dialogs.cancel.tooltip.reasonRequired");
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
      onExited={() => {
        setReason("");
        onExited?.();
      }}
      title={t("vehicleBusinessTrips.dialogs.cancel.title")}
      subtitle={
        cancellerEmployeeUserId
          ? t("vehicleBusinessTrips.dialogs.cancel.subtitle", {
              id: cancellerEmployeeUserId,
            })
          : t("vehicleBusinessTrips.dialogs.cancel.subtitle", { id: "-" })
      }
      headerIcon={<BlockOutlinedIcon sx={{ fontSize: 18 }} />}
      referenceText={
        tripId
          ? t("vehicleBusinessTrips.dialogs.common.referenceTrip", {
              id: tripId,
            })
          : t("vehicleBusinessTrips.dialogs.common.noTripSelected")
      }
      previewTitle={t("vehicleBusinessTrips.dialogs.common.tripDetailsTitle")}
      previewSubtitle={t("vehicleBusinessTrips.dialogs.cancel.previewSubtitle")}
      dueTone="neutral"
      previewFields={[
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
      ]}
      submitText={t("vehicleBusinessTrips.dialogs.cancel.submit")}
      cancelText={t("vehicleBusinessTrips.dialogs.cancel.close")}
      onSubmit={handleCancelTrip}
      submitting={submitting}
      submitDisabled={cancelDisabled}
      submitVariant="danger"
    >
      <Box>
        <Typography sx={{ fontSize: 12.5, color: "#6B7280", mb: 1.25 }}>
          {t("vehicleBusinessTrips.dialogs.cancel.helper")}
        </Typography>

        <TextField
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          disabled={submitting}
          placeholder={t("vehicleBusinessTrips.dialogs.cancel.placeholder")}
          size="small"
          helperText={
            trimmedReason.length > 0 && trimmedReason.length < 3
              ? t("vehicleBusinessTrips.dialogs.cancel.minChars")
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
            p: 1.25,
            borderRadius: 1,
            backgroundColor: "rgba(245,158,11,0.10)",
            border: "1px solid rgba(245,158,11,0.16)",
          }}
        >
          <Typography sx={{ fontSize: 12.5, color: "#111827" }}>
            {t("vehicleBusinessTrips.dialogs.cancel.cannotBeUndone")}
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
