import { useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Divider,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVehicleRegistration } from "../hooks/useVehicleRegistration";

function formatDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

function formatMoney(amount?: number | null, currency?: string | null) {
  if (amount == null) return "";
  const c = (currency ?? "").toUpperCase();
  return c ? `${amount.toFixed(2)} ${c}` : `${amount.toFixed(2)}`;
}

export default function VehicleRegistrationDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();

  const registrationId = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : 0;
  }, [id]);

  const query = useVehicleRegistration(registrationId);
  const reg = query.data;

  if (!registrationId) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Typography color="text.secondary">
          {t("vehicleRegistrations.detail.invalidId", "Neispravan ID.")}
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

  if (query.isError || !reg) {
    return (
      <Box p={4} display="flex" flexDirection="column" alignItems="center">
        <Typography color="error" gutterBottom>
          {t(
            "vehicleRegistrations.detail.loadError",
            "Neuspjelo učitavanje registracije vozila.",
          )}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            disableElevation
            onClick={() => query.refetch()}
          >
            {t("common.retry", "Pokušaj ponovno")}
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            {t("vehicleRegistrations.create.back", "Natrag")}
          </Button>
        </Stack>
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
              {t("vehicleRegistrations.detail.title", "Detalji registracije")}
            </Typography>
            <Chip
              label={`#${reg.id}`}
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            />
          </Stack>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-registrations")}
        >
          {t("vehicleRegistrations.create.back", "Natrag")}
        </Button>
      </Stack>

   
      <Paper
        elevation={0}
        sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" } }}
            />
          }
        >
      
          <Box sx={{ flex: 1 }}>
            <Stack spacing={1} height="100%" justifyContent="center">
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                color="text.secondary"
                mb={1}
              >
                <LocalShippingIcon fontSize="small" />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  textTransform="uppercase"
                >
                  {t("vehicleRegistrations.form.field.vehicleId", "Vozilo")}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                  }}
                >
                  <LocalShippingIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {reg.vehicleId}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

       
          <Box sx={{ flex: 1 }}>
            <Stack spacing={1} height="100%" justifyContent="center">
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                color="text.secondary"
                mb={1}
              >
                <BusinessIcon fontSize="small" />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  textTransform="uppercase"
                >
                  {t(
                    "vehicleRegistrations.form.field.registrationStationName",
                    "Stanica",
                  )}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: "info.main",
                  }}
                >
                  <BusinessIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {reg.registrationStationName || "—"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

      
          <Box sx={{ flex: 1.5 }}>
            <Stack spacing={2}>
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  color="text.secondary"
                  mb={0.5}
                >
                  <CalendarTodayIcon fontSize="small" />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    textTransform="uppercase"
                  >
                    {t("vehicleRegistrations.form.field.validFrom", "Od")}
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight={500}>
                  {formatDate(reg.validFrom)}
                </Typography>
              </Box>
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  color="text.secondary"
                  mb={0.5}
                >
                  <CalendarTodayIcon fontSize="small" />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    textTransform="uppercase"
                  >
                    {t("vehicleRegistrations.form.field.validTo", "Do")}
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight={500}>
                  {formatDate(reg.validTo)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems="stretch"
      >
       
        <Box sx={{ width: { xs: "100%", md: 350 }, flexShrink: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <AttachMoneyIcon color="warning" />
              <Typography variant="h6" fontWeight={600}>
                Detalji troškova
              </Typography>
            </Stack>

            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                >
                  {t(
                    "vehicleRegistrations.form.field.totalCostAmount",
                    "Ukupan trošak",
                  )}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="warning.main"
                  >
                    {formatMoney(reg.totalCostAmount, reg.costCurrency)}
                  </Typography>
                </Stack>
              </Box>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Trošak registracije za vozilo {reg.vehicleId}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

      
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
              <AssignmentIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                {t("vehicleRegistrations.detail.section.details", "Detalji")}
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ minWidth: 120 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t(
                      "vehicleRegistrations.form.field.reportNumber",
                      "Broj izvješća",
                    )}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500}>
                  {reg.reportNumber || "—"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ minWidth: 120 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t(
                      "vehicleRegistrations.form.field.registrationStationLocation",
                      "Lokacija",
                    )}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500}>
                  {reg.registrationStationLocation || "—"}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ minWidth: 120, pt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t(
                      "vehicleRegistrations.form.field.documentPath",
                      "Dokument",
                    )}
                  </Typography>
                </Box>
                <Box>
                  {reg.documentPath ? (
                    <Chip
                      icon={<InsertDriveFileIcon />}
                      label="Dokument"
                      variant="outlined"
                      onClick={() => {}}
                      sx={{ borderRadius: 1 }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      fontStyle="italic"
                      color="text.secondary"
                    >
                      Nema dokumenta
                    </Typography>
                  )}
                </Box>
              </Stack>
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
            {t("vehicleRegistrations.form.field.note", "Napomena")}
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {reg.note || t("common.dash", "—")}
        </Typography>
      </Paper>
    </Stack>
  );
}
