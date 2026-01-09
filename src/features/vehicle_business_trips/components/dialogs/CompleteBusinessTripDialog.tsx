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

type Props = {
  open: boolean;
  onClose: () => void;
  trip: VehicleBusinessTrip | null;
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
}: Props) {
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
    if (!open) return;
    setForm({
      startKilometers: "",
      endKilometers: "",
      refueled: false,
      fuelAmount: "",
      fuelCurrency: "EUR",
      fuelLiters: "",
      note: "",
    });
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
    if (submitting) return "Submitting…";
    if (!tripId) return "No trip selected";
    if (!kmValid) return "Enter valid start/end kilometers (end ≥ start)";
    if (!fuelValid) return "If refueled, fill fuel amount, currency and liters";
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
        fuelAmount: form.refueled ? fuelAmount ?? 0 : 0,
        fuelCurrency: form.refueled ? form.fuelCurrency : "",
        fuelLiters: form.refueled ? fuelLiters ?? 0 : 0,
        note: form.note.trim(),
      },
      { onSuccess: onClose }
    );
  };

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
      title="Complete business trip"
      subtitle="Fill in kilometers and optional fuel info"
      headerIcon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />}
      referenceText={tripId ? `Trip #${tripId}` : "No trip selected"}
      previewTitle="Trip details"
      previewSubtitle="Review dates and complete the trip with final data."
      dueTone="neutral"
      previewFields={[
        { label: "Start", value: startAt || "-", minWidth: 180 },
        { label: "End", value: endAt || "-", minWidth: 180 },
      ]}
      submitText="Complete"
      cancelText="Cancel"
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
            label="Start kilometers"
            value={form.startKilometers}
            onChange={(e) => setField("startKilometers", e.target.value)}
            disabled={submitting}
            inputMode="decimal"
            placeholder="e.g. 12450"
            error={form.startKilometers !== "" && startKm === null}
            helperText={
              form.startKilometers !== "" && startKm === null
                ? "Invalid number"
                : " "
            }
          />

          <TextField
            fullWidth
            size="small"
            label="End kilometers"
            value={form.endKilometers}
            onChange={(e) => setField("endKilometers", e.target.value)}
            disabled={submitting}
            inputMode="decimal"
            placeholder="e.g. 12610"
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
                ? "End must be ≥ start"
                : form.endKilometers !== "" && endKm === null
                ? "Invalid number"
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
            label="Refueled"
          />
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <TextField
            fullWidth
            size="small"
            label="Fuel amount"
            value={form.fuelAmount}
            onChange={(e) => setField("fuelAmount", e.target.value)}
            disabled={submitting || !form.refueled}
            inputMode="decimal"
            placeholder="e.g. 45.20"
            error={
              form.refueled && form.fuelAmount !== "" && fuelAmount === null
            }
            helperText={
              form.refueled && form.fuelAmount !== "" && fuelAmount === null
                ? "Invalid number"
                : " "
            }
          />

          <FormControl
            fullWidth
            size="small"
            disabled={submitting || !form.refueled}
          >
            <InputLabel id="fuel-currency-label">Currency</InputLabel>
            <Select
              labelId="fuel-currency-label"
              value={form.fuelCurrency}
              label="Currency"
              onChange={(e) => setField("fuelCurrency", e.target.value)}
            >
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label="Fuel liters"
            value={form.fuelLiters}
            onChange={(e) => setField("fuelLiters", e.target.value)}
            disabled={submitting || !form.refueled}
            inputMode="decimal"
            placeholder="e.g. 28.4"
            error={
              form.refueled && form.fuelLiters !== "" && fuelLiters === null
            }
            helperText={
              form.refueled && form.fuelLiters !== "" && fuelLiters === null
                ? "Invalid number"
                : " "
            }
          />
        </Stack>

        <TextField
          size="small"
          label="Note"
          value={form.note}
          onChange={(e) => setField("note", e.target.value)}
          disabled={submitting}
          multiline
          minRows={3}
          placeholder="Optional note…"
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
