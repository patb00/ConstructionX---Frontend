import { useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVehicleRegistration } from "../hooks/useVehicleRegistration";
import SectionTitle from "../../../components/ui/SectionTitle";
import ReadonlyField from "../../../components/ui/ReadonlyField";

function formatDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function formatMoney(amount?: number | null, currency?: string | null) {
  if (amount == null) return "";
  const c = (currency ?? "").toUpperCase();
  return c ? `${amount} ${c}` : `${amount}`;
}

export default function VehicleRegistrationDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const registrationId = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : 0;
  }, [id]);

  const query = useVehicleRegistration(registrationId);
  const reg = query.data;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {t(
              "vehicleRegistrations.detail.title",
              "Detalji registracije vozila",
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {t(
              "vehicleRegistrations.detail.subtitle",
              "Pregled detalja registracije vozila.",
            )}
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-registrations")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleRegistrations.create.back", "Natrag")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (th) => `1px solid ${th.palette.divider}`,
          p: 2,
        }}
      >
        {!registrationId ? (
          <Typography color="text.secondary">
            {t("vehicleRegistrations.detail.invalidId", "Neispravan ID.")}
          </Typography>
        ) : query.isLoading ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress size={22} />
          </Stack>
        ) : query.isError ? (
          <Stack spacing={1}>
            <Typography>
              {t(
                "vehicleRegistrations.detail.loadError",
                "Neuspjelo učitavanje registracije vozila.",
              )}
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
                onClick={() => navigate("/app/vehicle-registrations")}
                sx={{ textTransform: "none" }}
              >
                {t("vehicleRegistrations.create.back", "Natrag")}
              </Button>
            </Stack>
          </Stack>
        ) : !reg ? (
          <Typography color="text.secondary">
            {t(
              "vehicleRegistrations.detail.notFound",
              "Registracija nije pronađena.",
            )}
          </Typography>
        ) : (
          <Stack spacing={2}>
            <SectionTitle>
              {t("vehicleRegistrations.detail.section.basic", "Osnovno")}
            </SectionTitle>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t("vehicleRegistrations.columns.id", "ID")}
                value={reg.id}
                monospace
              />
              <ReadonlyField
                label={t("vehicleRegistrations.form.field.vehicleId", "Vozilo")}
                value={reg.vehicleId}
                monospace
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleRegistrations.form.field.validFrom",
                  "Vrijedi od",
                )}
                value={formatDate(reg.validFrom) || "—"}
              />
              <ReadonlyField
                label={t(
                  "vehicleRegistrations.form.field.validTo",
                  "Vrijedi do",
                )}
                value={formatDate(reg.validTo) || "—"}
              />
            </Stack>

            <Divider sx={{ my: 0.5 }} />

            <SectionTitle>
              {t("vehicleRegistrations.detail.section.details", "Detalji")}
            </SectionTitle>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleRegistrations.form.field.totalCostAmount",
                  "Ukupan trošak",
                )}
                value={
                  formatMoney(reg.totalCostAmount, reg.costCurrency) || "—"
                }
              />
              <ReadonlyField
                label={t(
                  "vehicleRegistrations.form.field.costCurrency",
                  "Valuta",
                )}
                value={(reg.costCurrency ?? "—").toUpperCase()}
                monospace
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleRegistrations.form.field.registrationStationName",
                  "Stanica registracije",
                )}
                value={reg.registrationStationName ?? "—"}
              />
              <ReadonlyField
                label={t(
                  "vehicleRegistrations.form.field.registrationStationLocation",
                  "Lokacija stanice",
                )}
                value={reg.registrationStationLocation ?? "—"}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t(
                  "vehicleRegistrations.form.field.reportNumber",
                  "Broj izvješća",
                )}
                value={reg.reportNumber ?? "—"}
                monospace
              />
              <ReadonlyField
                label={t(
                  "vehicleRegistrations.form.field.documentPath",
                  "Dokument",
                )}
                value={reg.documentPath ?? "—"}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <ReadonlyField
                label={t("vehicleRegistrations.form.field.note", "Napomena")}
                value={reg.note ?? "—"}
              />
              <Box sx={{ flex: 1, minWidth: 0 }} />
            </Stack>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
