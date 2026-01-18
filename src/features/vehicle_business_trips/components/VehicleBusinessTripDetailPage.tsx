import { useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useVehicleBusinessTrip } from "../hooks/useVehicleBusinessTrip";
import ReadonlyField from "../../../components/ui/ReadonlyField";
import SectionTitle from "../../../components/ui/SectionTitle";

function formatDateTime(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatMoney(amount?: number | null, currency?: string | null) {
  if (amount == null) return "";
  const c = (currency ?? "").toUpperCase();
  return c ? `${amount} ${c}` : `${amount}`;
}

export default function VehicleBusinessTripDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const businessTripId = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : 0;
  }, [id]);

  const query = useVehicleBusinessTrip(businessTripId);
  const trip = query.data;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {t("vehicleBusinessTrips.detail.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {t("vehicleBusinessTrips.detail.subtitle")}
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-business-trips")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleBusinessTrips.detail.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (th) => `1px solid ${th.palette.divider}`,
          p: 2,
        }}
      >
        {!businessTripId ? (
          <Typography color="text.secondary">
            {t("vehicleBusinessTrips.detail.invalidId")}
          </Typography>
        ) : query.isLoading ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress size={22} />
          </Stack>
        ) : query.isError ? (
          <Stack spacing={1}>
            <Typography>
              {t("vehicleBusinessTrips.detail.loadError")}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
              <Button
                size="small"
                variant="contained"
                disableElevation
                onClick={() => query.refetch()}
                sx={{ textTransform: "none" }}
              >
                {t("common.retry", "Pokušaj ponovno")}
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate("/app/vehicle-business-trips")}
                sx={{ textTransform: "none" }}
              >
                {t("vehicleBusinessTrips.detail.back")}
              </Button>
            </Stack>
          </Stack>
        ) : !trip ? (
          <Typography color="text.secondary">
            {t("vehicleBusinessTrips.detail.notFound")}
          </Typography>
        ) : (
          <Stack spacing={2}>
            <SectionTitle>
              {t("vehicleBusinessTrips.detail.section.basic")}
            </SectionTitle>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t("vehicleBusinessTrips.fields.id", "ID")}
                value={(trip as any).id ?? businessTripId}
                monospace
              />
              <ReadonlyField
                label={t("vehicleBusinessTrips.form.field.vehicleId", "Vozilo")}
                value={(trip as any).vehicleId}
                monospace
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.employeeId",
                  "Zaposlenik",
                )}
                value={(trip as any).employeeId}
                monospace
              />
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.purposeOfTrip",
                  "Svrha putovanja",
                )}
                value={(trip as any).purposeOfTrip}
              />
            </Stack>

            <Divider sx={{ my: 0.5 }} />

            <SectionTitle>
              {t("vehicleBusinessTrips.detail.section.routeAndTime")}
            </SectionTitle>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.startLocationText",
                  "Početna lokacija",
                )}
                value={(trip as any).startLocationText}
              />
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.endLocationText",
                  "Završna lokacija",
                )}
                value={(trip as any).endLocationText}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.startAt",
                  "Vrijeme početka",
                )}
                value={formatDateTime((trip as any).startAt) || "—"}
              />
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.endAt",
                  "Vrijeme završetka",
                )}
                value={formatDateTime((trip as any).endAt) || "—"}
              />
            </Stack>

            <Divider sx={{ my: 0.5 }} />

            <SectionTitle>
              {t("vehicleBusinessTrips.detail.section.kilometersAndFuel")}
            </SectionTitle>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.startKilometers",
                  "Kilometri (početak)",
                )}
                value={(trip as any).startKilometers}
                monospace
              />
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.endKilometers",
                  "Kilometri (kraj)",
                )}
                value={(trip as any).endKilometers}
                monospace
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.refueled",
                  "Točeno gorivo",
                )}
                value={
                  (trip as any).refueled
                    ? t("common.yes", "Da")
                    : t("common.no", "Ne")
                }
              />
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.fuelLiters",
                  "Gorivo (litre)",
                )}
                value={(trip as any).fuelLiters}
                monospace
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.fuelAmount",
                  "Iznos goriva",
                )}
                value={
                  formatMoney(
                    (trip as any).fuelAmount,
                    (trip as any).fuelCurrency,
                  ) || "—"
                }
              />
              <ReadonlyField
                label={t(
                  "vehicleBusinessTrips.form.field.fuelCurrency",
                  "Valuta",
                )}
                value={((trip as any).fuelCurrency ?? "—").toUpperCase()}
                monospace
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t("vehicleBusinessTrips.form.field.note", "Napomena")}
                value={(trip as any).note ?? "—"}
              />
              <Box sx={{ flex: 1, minWidth: 0 }} />
            </Stack>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
