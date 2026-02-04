import { useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import FlagIcon from "@mui/icons-material/Flag";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimelineIcon from "@mui/icons-material/Timeline";

import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useVehicleBusinessTrip } from "../hooks/useVehicleBusinessTrip";

function formatDateTime(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMoney(amount?: number | null, currency?: string | null) {
  if (amount == null) return "";
  const c = (currency ?? "").toUpperCase();
  return c ? `${amount.toFixed(2)} ${c}` : `${amount.toFixed(2)}`;
}

export default function VehicleBusinessTripDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();

  const businessTripId = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : 0;
  }, [id]);

  const query = useVehicleBusinessTrip(businessTripId);
  const trip = query.data;

  if (!businessTripId) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Typography color="text.secondary">
          {t("vehicleBusinessTrips.detail.invalidId")}
        </Typography>
      </Box>
    );
  }

  if (query.isLoading) {
    return (
      <Box p={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (query.isError || !trip) {
    return (
      <Box p={4} display="flex" flexDirection="column" alignItems="center">
        <Typography color="error" gutterBottom>
          {t("vehicleBusinessTrips.detail.loadError")}
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {t("vehicleBusinessTrips.detail.back")}
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={{ pb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h5" fontWeight={600}>
              {t("vehicleBusinessTrips.detail.title")}
            </Typography>
            <Chip
              label={`#${trip.id}`}
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            />
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {trip.purposeOfTrip || "—"}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-business-trips")}
        >
          {t("vehicleBusinessTrips.detail.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="h6" fontWeight={600}>
            {t("vehicleBusinessTrips.detail.section.basic")}
          </Typography>

          <Stack direction="row" spacing={3} alignItems="center">
            <Box display="flex" alignItems="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  mr: 2,
                  color: "primary.main",
                }}
              >
                <LocalShippingIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("vehicleBusinessTrips.form.field.vehicleId")}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {trip.vehicleId}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  mr: 2,
                  color: "info.main",
                }}
              >
                <PersonIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("vehicleBusinessTrips.form.field.employeeId")}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {trip.employeeName || trip.employeeId}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems="stretch"
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <TimelineIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                {t("vehicleBusinessTrips.detail.section.routeAndTime")}
              </Typography>
            </Stack>

            <Box
              sx={{
                position: "relative",
                pl: 2,
                borderLeft: `2px dashed ${theme.palette.divider}`,
                ml: 1,
              }}
            >
              <Box sx={{ position: "relative", mb: 4, pl: 3 }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: -9,
                    top: 0,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                    border: `3px solid ${theme.palette.background.paper}`,
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  display="block"
                  mb={0.5}
                >
                  {t("vehicleBusinessTrips.form.field.startLocationText")}
                </Typography>
                <Typography variant="body1" fontWeight={500} gutterBottom>
                  {trip.startLocationText}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 0.5 }}
                >
                  <CalendarTodayIcon
                    sx={{ fontSize: 14, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(trip.startAt)}
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ position: "relative", pl: 3 }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: -9,
                    top: 0,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: "error.main",
                    border: `3px solid ${theme.palette.background.paper}`,
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  display="block"
                  mb={0.5}
                >
                  {t("vehicleBusinessTrips.form.field.endLocationText")}
                </Typography>
                <Typography variant="body1" fontWeight={500} gutterBottom>
                  {trip.endLocationText}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 0.5 }}
                >
                  <FlagIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(trip.endAt)}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ width: { xs: "100%", md: 400 }, flexShrink: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              {t("vehicleBusinessTrips.detail.section.kilometersAndFuel")}
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Box flex={1}>
                  <Stack spacing={0.5}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      color="text.secondary"
                    >
                      <SpeedIcon fontSize="small" />
                      <Typography variant="caption">
                        {t("vehicleBusinessTrips.form.field.startKilometers")}
                      </Typography>
                    </Stack>
                    <Typography variant="h6">
                      {trip.startKilometers ?? "—"}
                    </Typography>
                  </Stack>
                </Box>
                <Box flex={1}>
                  <Stack spacing={0.5}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      color="text.secondary"
                    >
                      <SpeedIcon fontSize="small" />
                      <Typography variant="caption">
                        {t("vehicleBusinessTrips.form.field.endKilometers")}
                      </Typography>
                    </Stack>
                    <Typography variant="h6">
                      {trip.endKilometers ?? "—"}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Divider />

              <Stack direction="row" spacing={2}>
                <Box flex={1}>
                  <Stack spacing={0.5}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      color="text.secondary"
                    >
                      <LocalGasStationIcon fontSize="small" />
                      <Typography variant="caption">
                        {t("vehicleBusinessTrips.form.field.refueled")}
                      </Typography>
                    </Stack>
                    <Chip
                      label={trip.refueled ? t("common.yes") : t("common.no")}
                      size="small"
                      color={trip.refueled ? "success" : "default"}
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Stack>

              {trip.refueled && (
                <>
                  <Stack direction="row" spacing={2}>
                    <Box flex={1}>
                      <Stack spacing={0.5}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          color="text.secondary"
                        >
                          <LocalGasStationIcon fontSize="small" />
                          <Typography variant="caption">
                            {t("vehicleBusinessTrips.form.field.fuelLiters")}
                          </Typography>
                        </Stack>
                        <Typography variant="body1" fontWeight={600}>
                          {trip.fuelLiters} L
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      borderColor: alpha(theme.palette.warning.main, 0.2),
                      mt: "auto",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AttachMoneyIcon color="warning" />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {t("vehicleBusinessTrips.form.field.fuelAmount")}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color="warning.main"
                        >
                          {formatMoney(trip.fuelAmount, trip.fuelCurrency)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </>
              )}
            </Stack>
          </Paper>
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <DescriptionIcon color="action" />
          <Typography variant="h6" fontWeight={600}>
            {t("vehicleBusinessTrips.form.field.note")}
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {trip.note || t("common.dash")}
        </Typography>
      </Paper>
    </Stack>
  );
}
