import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { VehicleBusinessTrip } from "../..";
import { useCompleteVehicleBusinessTrip } from "../../hooks/useCompleteVehicleBusinessTrip";
import { AssignTaskDialog } from "../../../../components/ui/assign-dialog/AssignTaskDialog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
  onExited?: () => void;
};

type FormState = {
  startKilometers: string;
  endKilometers: string;
  refueled: boolean;
  fuelAmount: string;
  fuelCurrency: string;
  fuelLiters: string;
  note: string;
};

export default function CompleteBusinessTripDialog({
  open,
  onClose,
  trip,
  onExited,
}: Props) {
  const { t } = useTranslation();
  const completeMutation = useCompleteVehicleBusinessTrip();
  const submitting = completeMutation.isPending;

  const tripId = trip?.id ?? 0;
  const startAt = (trip as any)?.startAt ?? (trip as any)?.fromDate ?? "";
  const endAt = (trip as any)?.endAt ?? (trip as any)?.toDate ?? "";

  const [form, setForm] = useState<FormState>({
    startKilometers: "",
    endKilometers: "",
    refueled: false,
    fuelAmount: "",
    fuelCurrency: "EUR",
    fuelLiters: "",
    note: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        startKilometers: "",
        endKilometers: "",
        refueled: false,
        fuelAmount: "",
        fuelCurrency: "EUR",
        fuelLiters: "",
        note: "",
      });
    }
  }, [open, trip?.id]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const toNumberOrNull = (s: string) => {
    const n = Number(String(s).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };

  const startKm = toNumberOrNull(form.startKilometers);
  const endKm = toNumberOrNull(form.endKilometers);
  const fuelAmount = toNumberOrNull(form.fuelAmount);
  const fuelLiters = toNumberOrNull(form.fuelLiters);

  const kmValid =
    startKm !== null &&
    endKm !== null &&
    startKm >= 0 &&
    endKm >= 0 &&
    endKm >= startKm;

  const fuelValid = !form.refueled
    ? true
    : fuelAmount !== null &&
      fuelAmount > 0 &&
      !!form.fuelCurrency &&
      fuelLiters !== null &&
      fuelLiters > 0;

  const submitDisabled = submitting || !tripId || !kmValid || !fuelValid;

  const submitTooltip = (() => {
    if (submitting) {
      return t("vehicleBusinessTrips.dialogs.complete.tooltip.submitting");
    }
    if (!tripId) return t("vehicleBusinessTrips.dialogs.common.noTripSelected");
    if (!kmValid) {
      return t("vehicleBusinessTrips.dialogs.complete.tooltip.invalidKilometers");
    }
    if (!fuelValid) {
      return t("vehicleBusinessTrips.dialogs.complete.tooltip.invalidFuelDetails");
    }
    return "";
  })();

  const handleSubmit = () => {
    if (submitDisabled) return;
    if (startKm === null || endKm === null) return;

    completeMutation.mutate(
      {
        tripId,
        startKilometers: startKm,
        endKilometers: endKm,
        refueled: form.refueled,
        fuelAmount: form.refueled ? fuelAmount : null,
        fuelCurrency: form.refueled ? form.fuelCurrency : null,
        fuelLiters: form.refueled ? fuelLiters : null,
        note: form.note.trim(),
      },
      { onSuccess: onClose }
    );
  };

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
      onExited={() => {
        setForm({
          startKilometers: "",
          endKilometers: "",
          refueled: false,
          fuelAmount: "",
          fuelCurrency: "EUR",
          fuelLiters: "",
          note: "",
        });
        onExited?.();
      }}
      title={t("vehicleBusinessTrips.dialogs.complete.title")}
      subtitle={t("vehicleBusinessTrips.dialogs.complete.subtitle")}
      headerIcon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />}
      referenceText={
        tripId
          ? t("vehicleBusinessTrips.dialogs.common.referenceTrip", {
              id: tripId,
            })
          : t("vehicleBusinessTrips.dialogs.common.noTripSelected")
      }
      previewTitle={t("vehicleBusinessTrips.dialogs.common.tripDetailsTitle")}
      previewSubtitle={t("vehicleBusinessTrips.dialogs.complete.previewSubtitle")}
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
      submitText={t("vehicleBusinessTrips.dialogs.complete.submit")}
      cancelText={t("common.cancel")}
      onSubmit={handleSubmit}
      submitting={submitting}
      submitDisabled={submitDisabled}
      submitVariant="primary"
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <TextField
            fullWidth
            size="small"
            label={t("vehicleBusinessTrips.dialogs.complete.fields.startKilometers")}
            value={form.startKilometers}
            onChange={(e) => setField("startKilometers", e.target.value)}
            disabled={submitting}
            inputMode="decimal"
            placeholder={t(
              "vehicleBusinessTrips.dialogs.complete.placeholders.startKilometers",
            )}
            error={form.startKilometers !== "" && startKm === null}
            helperText={
              form.startKilometers !== "" && startKm === null
                ? t("vehicleBusinessTrips.dialogs.complete.validation.invalidNumber")
                : " "
            }
          />

          <TextField
            fullWidth
            size="small"
            label={t("vehicleBusinessTrips.dialogs.complete.fields.endKilometers")}
            value={form.endKilometers}
            onChange={(e) => setField("endKilometers", e.target.value)}
            disabled={submitting}
            inputMode="decimal"
            placeholder={t(
              "vehicleBusinessTrips.dialogs.complete.placeholders.endKilometers",
            )}
            error={
              form.endKilometers !== "" &&
              (endKm === null ||
                (startKm !== null && endKm !== null && endKm < startKm))
            }
            helperText={
              form.endKilometers !== "" &&
              startKm !== null &&
              endKm !== null &&
              endKm < startKm
                ? t(
                    "vehicleBusinessTrips.dialogs.complete.validation.endBeforeStart",
                  )
                : form.endKilometers !== "" && endKm === null
                ? t("vehicleBusinessTrips.dialogs.complete.validation.invalidNumber")
                : " "
            }
          />
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.25,
            borderRadius: 1,
            backgroundColor: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.14)",
          }}
        >
          <LocalGasStationOutlinedIcon sx={{ fontSize: 18, opacity: 0.75 }} />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.refueled}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setField("refueled", checked);

                  if (!checked) {
                    setField("fuelAmount", "");
                    setField("fuelLiters", "");
                    setField("fuelCurrency", "EUR");
                  }
                }}
                disabled={submitting}
              />
            }
            label={t("vehicleBusinessTrips.dialogs.complete.fields.refueled")}
          />
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <TextField
            fullWidth
            size="small"
            label={t("vehicleBusinessTrips.dialogs.complete.fields.fuelAmount")}
            value={form.fuelAmount}
            onChange={(e) => setField("fuelAmount", e.target.value)}
            disabled={submitting || !form.refueled}
            inputMode="decimal"
            placeholder={t(
              "vehicleBusinessTrips.dialogs.complete.placeholders.fuelAmount",
            )}
            error={
              form.refueled && form.fuelAmount !== "" && fuelAmount === null
            }
            helperText={
              form.refueled && form.fuelAmount !== "" && fuelAmount === null
                ? t("vehicleBusinessTrips.dialogs.complete.validation.invalidNumber")
                : " "
            }
          />

          <FormControl
            fullWidth
            size="small"
            disabled={submitting || !form.refueled}
          >
            <InputLabel id="fuel-currency-label">
              {t("vehicleBusinessTrips.dialogs.complete.fields.fuelCurrency")}
            </InputLabel>
            <Select
              labelId="fuel-currency-label"
              value={form.fuelCurrency}
              label={t("vehicleBusinessTrips.dialogs.complete.fields.fuelCurrency")}
              onChange={(e) => setField("fuelCurrency", e.target.value)}
            >
              <MenuItem value="EUR">{t("currency.eur")}</MenuItem>
              <MenuItem value="USD">{t("currency.usd")}</MenuItem>
              <MenuItem value="GBP">{t("currency.gbp")}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label={t("vehicleBusinessTrips.dialogs.complete.fields.fuelLiters")}
            value={form.fuelLiters}
            onChange={(e) => setField("fuelLiters", e.target.value)}
            disabled={submitting || !form.refueled}
            inputMode="decimal"
            placeholder={t(
              "vehicleBusinessTrips.dialogs.complete.placeholders.fuelLiters",
            )}
            error={
              form.refueled && form.fuelLiters !== "" && fuelLiters === null
            }
            helperText={
              form.refueled && form.fuelLiters !== "" && fuelLiters === null
                ? t("vehicleBusinessTrips.dialogs.complete.validation.invalidNumber")
                : " "
            }
          />
        </Stack>

        <TextField
          size="small"
          label={t("vehicleBusinessTrips.dialogs.complete.fields.note")}
          value={form.note}
          onChange={(e) => setField("note", e.target.value)}
          disabled={submitting}
          multiline
          minRows={3}
          placeholder={t(
            "vehicleBusinessTrips.dialogs.complete.placeholders.note",
          )}
        />

        {submitDisabled && submitTooltip ? (
          <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
            {submitTooltip}
          </Typography>
        ) : null}
      </Stack>
    </AssignTaskDialog>
  );
}
