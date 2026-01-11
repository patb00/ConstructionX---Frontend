import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { SelectedMarker } from "../../../features/map/types";

type MapMarkerDetailsPanelProps = {
  selectedMarker: SelectedMarker | null;
  onClose: () => void;
};

export default function MapMarkerDetailsPanel({
  selectedMarker,
  onClose,
}: MapMarkerDetailsPanelProps) {
  if (!selectedMarker) return null;

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
            {selectedMarker.kind === "condo"
              ? `Condo #${selectedMarker.condo.id}`
              : selectedMarker.kind === "site"
              ? selectedMarker.site.name
              : `Trip #${selectedMarker.trip.id}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {selectedMarker.kind === "condo"
              ? selectedMarker.condo.address ?? "No address"
              : selectedMarker.kind === "site"
              ? selectedMarker.site.location ?? "No location"
              : selectedMarker.kind === "trip-start"
              ? selectedMarker.trip.startLocationText ?? "No start"
              : selectedMarker.trip.endLocationText ?? "No end"}
          </Typography>
        </Box>

        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, overflow: "auto" }}>
        {selectedMarker.kind === "condo" && (
          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                Capacity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMarker.condo.capacity}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                Occupied
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMarker.condo.currentlyOccupied}/
                {selectedMarker.condo.capacity}
              </Typography>
            </Stack>
            {selectedMarker.condo.responsibleEmployeeName && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Responsible
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
                Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {String(selectedMarker.site.status)}
              </Typography>
            </Stack>
            {selectedMarker.site.siteManagerName && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Manager
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMarker.site.siteManagerName}
                </Typography>
              </Stack>
            )}
            {selectedMarker.site.startDate && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Start
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMarker.site.startDate}
                </Typography>
              </Stack>
            )}
            {selectedMarker.site.plannedEndDate && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Planned end
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMarker.site.plannedEndDate}
                </Typography>
              </Stack>
            )}
            {selectedMarker.site.description && (
              <Box sx={{ pt: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Description
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
                Start
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMarker.trip.startLocationText ?? "—"}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                End
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMarker.trip.endLocationText ?? "—"}
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
