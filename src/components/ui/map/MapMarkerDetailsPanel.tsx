import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { SelectedMarker } from "../../../features/map";
import { useTranslation } from "react-i18next";

type MapMarkerDetailsPanelProps = {
  selectedMarker: SelectedMarker | null;
  onClose: () => void;
};

export default function MapMarkerDetailsPanel({
  selectedMarker,
  onClose,
}: MapMarkerDetailsPanelProps) {
  const { t } = useTranslation();

  if (!selectedMarker) return null;

  const title =
    selectedMarker.kind === "condo"
      ? t("map.markerDetails.title.condo", { id: selectedMarker.condo.id })
      : selectedMarker.kind === "site"
      ? selectedMarker.site.name
      : t("map.markerDetails.title.trip", { id: selectedMarker.trip.id });

  const subtitle =
    selectedMarker.kind === "condo"
      ? selectedMarker.condo.address ??
        t("map.markerDetails.fallback.noAddress")
      : selectedMarker.kind === "site"
      ? selectedMarker.site.location ??
        t("map.markerDetails.fallback.noLocation")
      : selectedMarker.kind === "trip-start"
      ? selectedMarker.trip.startLocationText ??
        t("map.markerDetails.fallback.noStart")
      : selectedMarker.trip.endLocationText ??
        t("map.markerDetails.fallback.noEnd");

  return (
    <Paper
      elevation={6}
      sx={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 12,
        borderRadius: 3,
        overflow: "hidden",
        maxHeight: { xs: "52%", md: "46%" },
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900 }} noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {subtitle}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t("common.close")}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, overflow: "auto" }}>
        {selectedMarker.kind === "condo" && (
          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {t("map.markerDetails.condo.capacity")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMarker.condo.capacity}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {t("map.markerDetails.condo.occupied")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMarker.condo.currentlyOccupied}/
                {selectedMarker.condo.capacity}
              </Typography>
            </Stack>

            {selectedMarker.condo.responsibleEmployeeName && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {t("map.markerDetails.condo.responsible")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMarker.condo.responsibleEmployeeName}
                </Typography>
              </Stack>
            )}
          </Stack>
        )}

        {selectedMarker.kind === "site" && (
          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {t("map.markerDetails.site.status")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {String(selectedMarker.site.status)}
              </Typography>
            </Stack>

            {selectedMarker.site.siteManagerName && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {t("map.markerDetails.site.manager")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMarker.site.siteManagerName}
                </Typography>
              </Stack>
            )}

            {selectedMarker.site.startDate && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {t("map.markerDetails.site.start")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMarker.site.startDate}
                </Typography>
              </Stack>
            )}

            {selectedMarker.site.plannedEndDate && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {t("map.markerDetails.site.plannedEnd")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMarker.site.plannedEndDate}
                </Typography>
              </Stack>
            )}

            {selectedMarker.site.description && (
              <Box sx={{ pt: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {t("map.markerDetails.site.description")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMarker.site.description}
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {(selectedMarker.kind === "trip-start" ||
          selectedMarker.kind === "trip-end") && (
          <Stack spacing={1}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {t("map.markerDetails.trip.start")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMarker.trip.startLocationText ?? t("common.dash")}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {t("map.markerDetails.trip.end")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMarker.trip.endLocationText ?? t("common.dash")}
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
