import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";
import CommuteIcon from "@mui/icons-material/Commute";
import type { SelectedMarker } from "../../../features/map";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { useConstructionSiteStatusOptions } from "../../../features/constants/enum/useConstructionSiteStatusOptions";

type MapMarkerDetailsPanelProps = {
  selectedMarker: SelectedMarker | null;
  onClose: () => void;
};

export default function MapMarkerDetailsPanel({
  selectedMarker,
  onClose,
}: MapMarkerDetailsPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const statusOptions = useConstructionSiteStatusOptions();

  if (!selectedMarker) return null;

  let title = "";
  let subtitle = "";
  let icon = <BusinessIcon />;
  let color = "primary.main";

  if (selectedMarker.kind === "condo") {
    title = t("map.markerDetails.title.condo", { id: selectedMarker.condo.id });
    subtitle = selectedMarker.condo.address ?? t("map.markerDetails.fallback.noAddress");
    icon = <HomeIcon sx={{ color: "#2e7d32" }} />;
    color = "#2e7d32";
  } else if (selectedMarker.kind === "site") {
    title = selectedMarker.site.name;
    subtitle = selectedMarker.site.location ?? t("map.markerDetails.fallback.noLocation");
    icon = <BusinessIcon sx={{ color: "#ed6c02" }} />;
    color = "#ed6c02";
  } else {
    // Trip
    title = t("map.markerDetails.title.trip", { id: selectedMarker.trip.id });
    subtitle =
      selectedMarker.kind === "trip-start"
        ? (selectedMarker.trip.startLocationText ?? t("map.markerDetails.fallback.noStart"))
        : (selectedMarker.trip.endLocationText ?? t("map.markerDetails.fallback.noEnd"));
    icon = <CommuteIcon sx={{ color: "#1976d2" }} />;
    color = "#1976d2";
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: "absolute",
        left: { xs: 8, md: 16 },
        right: { xs: 8, md: "auto" },
        bottom: { xs: 16, md: "auto" },
        top: { xs: "auto", md: 16 },
        width: { xs: "auto", md: 360 },
        borderRadius: 4,
        overflow: "hidden",
        maxHeight: { xs: "60%", md: "80%" },
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        bgcolor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.8)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          gap: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: `${color}15`,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }} noWrap>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t("common.close")}
          sx={{ bgcolor: "rgba(0,0,0,0.04)", "&:hover": { bgcolor: "rgba(0,0,0,0.08)" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5, overflow: "auto" }}>
        
        {/* Actions similar to premium maps */}
        <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<DirectionsIcon />}
            sx={{ flex: 1, textTransform: 'none', borderRadius: 2, bgcolor: color, "&:hover": { bgcolor: color } }}
            onClick={() => {
                // Open google maps in new tab
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(subtitle)}`, '_blank');
            }}
          >
            {t("common.navigate")}
          </Button>

          {/* Details Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<InfoIcon />}
            sx={{ flex: 1, textTransform: 'none', borderRadius: 2, borderColor: color, color: color, "&:hover": { borderColor: color, bgcolor: `${color}10` } }}
            onClick={() => {
                let path = "";
                if (selectedMarker.kind === "site") {
                    path = `/app/constructionSites/${selectedMarker.site.id}/details`;
                } else if (selectedMarker.kind === "condo") {
                    path = `/app/condos/${selectedMarker.condo.id}/details`;
                } else {
                    // trip
                    path = `/app/vehicle-business-trips/${selectedMarker.trip.id}/details`;
                }
                navigate(path);
            }}
          >
            {t("common.details")}
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {selectedMarker.kind === "condo" && (
          <Stack spacing={1.5}>
            <DetailRow 
                label={t("map.markerDetails.condo.capacity")} 
                value={selectedMarker.condo.capacity} 
            />
            <DetailRow 
                label={t("map.markerDetails.condo.occupied")} 
                value={
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2">{selectedMarker.condo.currentlyOccupied}/{selectedMarker.condo.capacity}</Typography>
                        <Chip 
                            size="small" 
                            label={`${Math.round((selectedMarker.condo.currentlyOccupied / selectedMarker.condo.capacity) * 100)}%`} 
                            color={selectedMarker.condo.currentlyOccupied >= selectedMarker.condo.capacity ? "error" : "success"}
                            variant="outlined"
                            sx={{ height: 20, fontSize: 10 }}
                        />
                    </Stack>
                }
            />
            {selectedMarker.condo.responsibleEmployeeName && (
               <DetailRow 
                label={t("map.markerDetails.condo.responsible")} 
                value={selectedMarker.condo.responsibleEmployeeName} 
              />
            )}
          </Stack>
        )}

        {selectedMarker.kind === "site" && (
          <Stack spacing={1.5}>
            <DetailRow
              label={t("map.markerDetails.site.status")}
              value={(() => {
                const label =
                  statusOptions.find(
                    (opt) =>
                      Number(opt.value) === Number(selectedMarker.site.status)
                  )?.label ?? String(selectedMarker.site.status);
                return (
                  <Chip
                    label={label}
                    size="small"
                    color="primary"
                    sx={{ color: "white" }}
                  />
                );
              })()}
            />
            {selectedMarker.site.siteManagerName && (
               <DetailRow 
                label={t("map.markerDetails.site.manager")} 
                value={selectedMarker.site.siteManagerName}
              />
            )}
            {selectedMarker.site.startDate && (
               <DetailRow 
                label={t("map.markerDetails.site.start")} 
                value={selectedMarker.site.startDate}
              />
            )}
            {selectedMarker.site.plannedEndDate && (
               <DetailRow 
                label={t("map.markerDetails.site.plannedEnd")} 
                value={selectedMarker.site.plannedEndDate}
              />
            )}
            {selectedMarker.site.description && (
               <Box sx={{ pt: 1, bgcolor: "action.hover", p: 1.5, borderRadius: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary', textTransform: 'uppercase' }}>
                   {t("map.markerDetails.site.description")}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedMarker.site.description}
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {(selectedMarker.kind === "trip-start" ||
          selectedMarker.kind === "trip-end") && (
          <Stack spacing={2}>
            {selectedMarker.trip.employeeName && (
              <DetailRow
                label={t("vehicleBusinessTrips.form.field.employeeId")}
                value={selectedMarker.trip.employeeName}
              />
            )}
            {(selectedMarker.trip.vehicleRegistrationNumber ||
              selectedMarker.trip.vehicleBrand ||
              selectedMarker.trip.vehicleModel) && (
              <DetailRow
                label={t("vehicleBusinessTrips.form.field.vehicleId")}
                value={
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" fontWeight={700}>
                      {selectedMarker.trip.vehicleRegistrationNumber ?? "—"}
                    </Typography>
                    {(selectedMarker.trip.vehicleBrand ||
                      selectedMarker.trip.vehicleModel) && (
                      <Typography variant="caption" color="text.secondary">
                        {selectedMarker.trip.vehicleBrand}{" "}
                        {selectedMarker.trip.vehicleModel}
                      </Typography>
                    )}
                  </Box>
                }
              />
            )}
            <Divider />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                {t("map.markerDetails.trip.start")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {selectedMarker.trip.startLocationText ?? t("common.dash")}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                {t("map.markerDetails.trip.end")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {selectedMarker.trip.endLocationText ?? t("common.dash")}
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {label}
            </Typography>
            <Box sx={{ fontWeight: 700, fontSize: 14 }}>
               {typeof value === 'string' || typeof value === 'number' ? <Typography variant="body2" fontWeight={700}>{value}</Typography> : value}
            </Box>
        </Stack>
    );
}
