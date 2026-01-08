import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { Box, TextField, Typography } from "@mui/material";
import type { VehicleBusinessTrip } from "../..";
import { useRejectVehicleBusinessTrip } from "../../hooks/useRejectVehicleBusinessTrip";
import { AssignTaskDialog } from "../../../../components/ui/assign-dialog/AssignTaskDialog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const rejectMutation = useRejectVehicleBusinessTrip();
  const submitting = rejectMutation.isPending;

  const tripId = trip?.id ?? 0;

  const startAt = (trip as any)?.startAt ?? (trip as any)?.fromDate ?? "";
  const endAt = (trip as any)?.endAt ?? (trip as any)?.toDate ?? "";

  const [reason, setReason] = useState("");

  useEffect(() => {
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
      title={t("vehicleBusinessTrips.dialogs.reject.title")}
      subtitle={
        rejectorEmployeeUserId
          ? t("vehicleBusinessTrips.dialogs.reject.subtitle", {
              id: rejectorEmployeeUserId,
            })
          : t("vehicleBusinessTrips.dialogs.reject.subtitle", { id: "-" })
      }
      headerIcon={<ThumbDownAltOutlinedIcon sx={{ fontSize: 18 }} />}
      referenceText={
        tripId
          ? t("vehicleBusinessTrips.dialogs.common.referenceTrip", {
              id: tripId,
            })
          : t("vehicleBusinessTrips.dialogs.common.noTripSelected")
      }
      previewTitle={t("vehicleBusinessTrips.dialogs.common.tripDetailsTitle")}
      previewSubtitle={t("vehicleBusinessTrips.dialogs.reject.previewSubtitle")}
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
      submitText={t("vehicleBusinessTrips.table.reject")}
      cancelText={t("vehicleBusinessTrips.dialogs.common.cancel")}
      onSubmit={handleReject}
      submitting={submitting}
      submitDisabled={rejectDisabled}
      submitVariant="danger"
    >
      <Box>
        <Typography sx={{ fontSize: 12.5, color: "#6B7280", mb: 1.25 }}>
          {t("vehicleBusinessTrips.dialogs.reject.helper")}
        </Typography>

        <TextField
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          disabled={submitting}
          placeholder={t("vehicleBusinessTrips.dialogs.reject.placeholder")}
          size="small"
          helperText={
            trimmedReason.length > 0 && trimmedReason.length < 3
              ? t("vehicleBusinessTrips.dialogs.reject.minChars")
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
            {t("vehicleBusinessTrips.dialogs.reject.note")}
          </Typography>
        </Box>
      </Box>
    </AssignTaskDialog>
  );
}
