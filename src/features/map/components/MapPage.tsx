import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Marker, Source, Layer } from "react-map-gl/maplibre";
import type { LayerProps } from "react-map-gl/maplibre";
import { useTranslation } from "react-i18next";
import { useVehicleBusinessTrips } from "../../vehicle_business_trips/hooks/useVehicleBusinessTrips";
import { useVehicleBusinessTripsByVehicle } from "../../vehicle_business_trips/hooks/useVehicleBusinessTripsByVehicle";
import { useVehicleBusinessTripsByEmployee } from "../../vehicle_business_trips/hooks/useVehicleBusinessTripsByEmployee";
import { useCondos } from "../../condos/hooks/useCondos";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";
import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import { TrackingCard } from "../../../components/ui/map/TrackingCard";
import { useConstructionSites } from "../../construction_site/hooks/useConstructionSites";
import MapMarkerDetailsPanel from "../../../components/ui/map/MapMarkerDetailsPanel";
import MapLibreLayer from "./MapLibreLayer";
import type {
  CondoRow,
  FilterMode,
  GeoCache,
  RouteByTripId,
  SelectedMarker,
  TripRow,
} from "..";
import {
  geocodePhoton,
  isProbablyDummy,
  loadGeoCache,
  normalizeLocationText,
  saveGeoCache,
} from "../utils/geocoding";
import { MapApi } from "../api/map.api";

const routeLayerStyle: LayerProps = {
  id: "route",
  type: "line",
  paint: {
    "line-color": "#1976d2",
    "line-width": 4,
    "line-opacity": 0.8,
  },
};

export default function MapPage() {
  const { t } = useTranslation();

  const [mode, setMode] = useState<FilterMode>("all");
  const [vehicleId, setVehicleId] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number>(0);

  const [showCondos, setShowCondos] = useState(true);
  const [showTrips, setShowTrips] = useState(true);
  const [showConstructionSites, setShowConstructionSites] = useState(true);

  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(
    null,
  );

  const allTripsQ = useVehicleBusinessTrips();
  const tripsByVehicleQ = useVehicleBusinessTripsByVehicle(vehicleId);
  const tripsByEmployeeQ = useVehicleBusinessTripsByEmployee(employeeId);

  const { condosRows } = useCondos({ page: 0, pageSize: 1000 });
  const { options: vehicleOptions } = useVehicleOptions();
  const { options: employeeOptions } = useEmployeeOptions();
  
  const constructionSiteArgs = useMemo(() => ({
    statusOptions: [],
    employeeOptions: [],
    toolOptions: [],
    vehicleOptions: [],
  }), []);

  const { constructionSitesRows } = useConstructionSites(constructionSiteArgs);

  const tripsRows: TripRow[] = useMemo(() => {
    if (mode === "vehicle") return (tripsByVehicleQ.data ?? []) as any;
    if (mode === "employee")
      return (tripsByEmployeeQ.vehicleBusinessTripsRows ?? []) as any;
    return (allTripsQ.vehicleBusinessTripsRows ?? []) as any;
  }, [
    mode,
    vehicleId,
    employeeId,
    tripsByVehicleQ.data,
    tripsByEmployeeQ.vehicleBusinessTripsRows,
    allTripsQ.vehicleBusinessTripsRows,
  ]);

  const condos: CondoRow[] = useMemo(
    () =>
      (condosRows ?? []).map((c: any) => ({
        id: c.id,
        address: c.address ?? null,
        capacity: c.capacity ?? 0,
        currentlyOccupied: c.currentlyOccupied ?? 0,
        responsibleEmployeeName: c.responsibleEmployeeName ?? null,
      })),
    [condosRows],
  );

  const selectedVehicleLabel =
    vehicleOptions.find((o) => o.value === vehicleId)?.label ??
    t("common.dash");
  const selectedEmployeeLabel =
    employeeOptions.find((o) => o.value === employeeId)?.label ??
    t("common.dash");

  const [geoByText, setGeoByText] = useState<GeoCache>({});

  const [routeByTripId, setRouteByTripId] = useState<RouteByTripId>({});

  useEffect(() => {
    const ac = new AbortController();

    async function run() {
      const texts = new Set<string>();

      if (showTrips) {
        for (const t of tripsRows) {
          const s = t.startLocationText?.trim();
          const e = t.endLocationText?.trim();
          if (s && !isProbablyDummy(s)) texts.add(normalizeLocationText(s));
          if (e && !isProbablyDummy(e)) texts.add(normalizeLocationText(e));
        }
      }

      if (showCondos) {
        for (const c of condos) {
          const a = c.address?.trim();
          if (a && !isProbablyDummy(a)) texts.add(normalizeLocationText(a));
        }
      }

      if (showConstructionSites) {
        for (const s of constructionSitesRows ?? []) {
          const loc = (s as any)?.location?.trim();
          if (loc && !isProbablyDummy(loc))
            texts.add(normalizeLocationText(loc));
        }
      }

      // Collect only what we don't have
      let hasNewGeo = false;
      const nextCache = { ...loadGeoCache() };

      for (const text of texts) {
        if (ac.signal.aborted) return;
        if (nextCache[text]) continue;

        const p = await geocodePhoton(text, ac.signal);
        if (p) {
          nextCache[text] = p;
          hasNewGeo = true;
          saveGeoCache(nextCache);
        }
      }
      
      if (hasNewGeo && !ac.signal.aborted) {
        setGeoByText(nextCache);
      } else if (Object.keys(geoByText).length === 0) {
        // Initial load
        setGeoByText(nextCache);
      }

      const nextRoutes: Record<number, [number, number][]> = {};
      let hasRouteChanges = false;
      if (showTrips) {
        for (const t of tripsRows) {
          if (ac.signal.aborted) return;

          const sRaw = t.startLocationText?.trim();
          const eRaw = t.endLocationText?.trim();
          if (!sRaw || !eRaw || isProbablyDummy(sRaw) || isProbablyDummy(eRaw)) continue;

          const s = normalizeLocationText(sRaw);
          const e = normalizeLocationText(eRaw);

          const start = nextCache[s];
          const end = nextCache[e];
          if (!start || !end) continue;

          // Only fetch if not already in state
          if (routeByTripId[t.id]) {
            nextRoutes[t.id] = routeByTripId[t.id];
            continue;
          }

          const route = await MapApi.getRoute(undefined, start, end, ac.signal);
          if (route) {
            nextRoutes[t.id] = route;
            hasRouteChanges = true;
          }
        }
      }

      if (hasRouteChanges && !ac.signal.aborted) {
        setRouteByTripId(nextRoutes);
      } else if (Object.keys(nextRoutes).length !== Object.keys(routeByTripId).length) {
        setRouteByTripId(nextRoutes);
      }
    }

    run().catch(() => {});
    return () => ac.abort();
  }, [
    tripsRows,
    condos,
    constructionSitesRows,
    showTrips,
    showCondos,
    showConstructionSites,
  ]);

  useEffect(() => {
    if (mode === "all") {
      setVehicleId(0);
      setEmployeeId(0);
    }
    if (mode === "vehicle") {
      setEmployeeId(0);
    }
    if (mode === "employee") {
      setVehicleId(0);
    }
  }, [mode]);

  const renderCondos = () => {
    if (!showCondos) return null;
    return condos.map((c) => {
      const addrRaw = c.address?.trim();
      if (!addrRaw || isProbablyDummy(addrRaw)) return null;
      const addr = normalizeLocationText(addrRaw);
      const p = geoByText[addr];
      if (!p) return null;

      return (
        <Marker
          key={`condo-${c.id}`}
          longitude={p.lon}
          latitude={p.lat}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedMarker({ kind: "condo", condo: c });
          }}
          style={{ cursor: "pointer" }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#2e7d32",
              border: "2px solid white",
              boxShadow: "0 1px 4px rgba(0,0,0,.35)",
            }}
          />
        </Marker>
      );
    });
  };

  const renderSites = () => {
    if (!showConstructionSites) return null;
    return (constructionSitesRows ?? []).map((s: any) => {
      const locRaw = s.location?.trim();
      if (!locRaw || isProbablyDummy(locRaw)) return null;
      const loc = normalizeLocationText(locRaw);
      const p = geoByText[loc];
      if (!p) return null;

      return (
        <Marker
          key={`site-${s.id}`}
          longitude={p.lon}
          latitude={p.lat}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedMarker({ kind: "site", site: s });
          }}
          style={{ cursor: "pointer" }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#ed6c02",
              border: "2px solid white",
              boxShadow: "0 1px 4px rgba(0,0,0,.35)",
            }}
          />
        </Marker>
      );
    });
  };

  const renderTrips = () => {
    if (!showTrips) return null;
    return tripsRows.map((t) => {
      const sRaw = t.startLocationText?.trim();
      const eRaw = t.endLocationText?.trim();
      if (!sRaw || !eRaw) return null;
      if (isProbablyDummy(sRaw) || isProbablyDummy(eRaw)) return null;

      const s = normalizeLocationText(sRaw);
      const e = normalizeLocationText(eRaw);
      const start = geoByText[s];
      const end = geoByText[e];
      if (!start || !end) return null;

      const route = routeByTripId[t.id];

      const geometryCoordinates = route
        ? route.map(([lat, lon]) => [lon, lat])
        : [
            [start.lon, start.lat],
            [end.lon, end.lat],
          ];

      const tripGeoJson: any = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: geometryCoordinates,
        },
        properties: { tripId: t.id },
      };

      return (
        <div key={`trip-${t.id}`}>
          <Marker
            longitude={start.lon}
            latitude={start.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedMarker({ kind: "trip-start", trip: t });
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#1976d2",
                border: "2px solid white",
                boxShadow: "0 1px 4px rgba(0,0,0,.35)",
              }}
            />
          </Marker>
          <Marker
            longitude={end.lon}
            latitude={end.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedMarker({ kind: "trip-end", trip: t });
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#1976d2",
                border: "2px solid white",
                boxShadow: "0 1px 4px rgba(0,0,0,.35)",
              }}
            />
          </Marker>

          {/* Line */}
          <Source id={`trip-source-${t.id}`} type="geojson" data={tripGeoJson}>
            <Layer {...routeLayerStyle} id={`trip-layer-${t.id}`} />
          </Source>
        </div>
      );
    });
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            flex: { md: 1 },
            minWidth: 0,
            height: { xs: "60vh", md: "100%" },
            minHeight: { xs: 280, md: "unset" },
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <MapLibreLayer>
            {renderCondos()}
            {renderSites()}
            {renderTrips()}
          </MapLibreLayer>

          <MapMarkerDetailsPanel
            selectedMarker={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "background.default",
            width: { xs: "100%", md: 420 },
            minWidth: { md: 420 },
            flexShrink: 0,
            height: { xs: "auto", md: "100%" },
            position: { md: "sticky" },
            top: { md: 0 },
            alignSelf: { md: "flex-start" },
          }}
        >
          <Stack sx={{ height: "100%", width: "100%" }}>
            <Stack
              spacing={1.25}
              sx={{
                flex: 1,
                minHeight: 0,
                overflow: { xs: "visible", md: "auto" },
              }}
            >
              <TrackingCard
                badge={{
                  text: showTrips
                    ? t("map.page.toggle.on")
                    : t("map.page.toggle.off"),
                  color: showTrips ? "success" : "default",
                }}
                title={t("map.page.trips.title")}
                subtitle={t("map.page.trips.subtitle")}
                line1Label={t("map.page.trips.scopeLabel")}
                line1Value={
                  mode === "all"
                    ? t("map.page.scope.all")
                    : mode === "vehicle"
                      ? t("map.page.scope.vehicle")
                      : t("map.page.scope.employee")
                }
                line2Label={t("map.page.trips.visibleLabel")}
                line2Value={`${tripsRows.length}`}
                bottomNote={
                  mode === "vehicle"
                    ? t("map.page.trips.vehicleNote", {
                        vehicle: selectedVehicleLabel,
                      })
                    : mode === "employee"
                      ? t("map.page.trips.employeeNote", {
                          employee: selectedEmployeeLabel,
                        })
                      : t("map.page.trips.allNote")
                }
                accent="#1976d2"
              >
                <Stack spacing={1}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="mode-label">
                      {t("map.page.trips.scopeInput")}
                    </InputLabel>
                    <Select
                      labelId="mode-label"
                      value={mode}
                      label={t("map.page.trips.scopeInput")}
                      onChange={(e) => setMode(e.target.value as FilterMode)}
                    >
                      <MenuItem value="all">{t("map.page.scope.all")}</MenuItem>
                      <MenuItem value="vehicle">
                        {t("map.page.scope.vehicle")}
                      </MenuItem>
                      <MenuItem value="employee">
                        {t("map.page.scope.employee")}
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {mode === "vehicle" && (
                    <FormControl fullWidth size="small">
                      <InputLabel id="vehicle-label">
                        {t("map.page.trips.vehicleInput")}
                      </InputLabel>
                      <Select
                        labelId="vehicle-label"
                        value={vehicleId}
                        label={t("map.page.trips.vehicleInput")}
                        onChange={(e) => setVehicleId(Number(e.target.value))}
                        sx={{
                          "& .MuiSelect-select": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      >
                        <MenuItem value={0}>
                          {t("map.page.trips.vehiclePlaceholder")}
                        </MenuItem>
                        {vehicleOptions.map((o) => (
                          <MenuItem key={o.value} value={o.value}>
                            {o.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {mode === "employee" && (
                    <FormControl fullWidth size="small">
                      <InputLabel id="employee-label">
                        {t("map.page.trips.employeeInput")}
                      </InputLabel>
                      <Select
                        labelId="employee-label"
                        value={employeeId}
                        label={t("map.page.trips.employeeInput")}
                        onChange={(e) => setEmployeeId(Number(e.target.value))}
                        sx={{
                          "& .MuiSelect-select": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      >
                        <MenuItem value={0}>
                          {t("map.page.trips.employeePlaceholder")}
                        </MenuItem>
                        {employeeOptions.map((o) => (
                          <MenuItem key={o.value} value={o.value}>
                            {o.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  <Divider />

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                        {t("map.page.trips.showLabel")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("map.page.trips.showDescription")}
                      </Typography>
                    </Box>
                    <Switch
                      checked={showTrips}
                      onChange={(e) => setShowTrips(e.target.checked)}
                    />
                  </Stack>
                </Stack>
              </TrackingCard>

              <TrackingCard
                badge={{
                  text: showCondos
                    ? t("map.page.toggle.on")
                    : t("map.page.toggle.off"),
                  color: showCondos ? "success" : "default",
                }}
                title={t("map.page.condos.title")}
                subtitle={t("map.page.condos.subtitle")}
                line1Label={t("map.page.condos.visibleLabel")}
                line1Value={`${condos.length}`}
                line2Label={t("map.page.condos.geocodedLabel")}
                line2Value={`${
                  condos.filter((c) => {
                    const a = c.address?.trim();
                    if (!a || isProbablyDummy(a)) return false;
                    return Boolean(geoByText[normalizeLocationText(a)]);
                  }).length
                }`}
                bottomNote={t("map.page.condos.bottomNote")}
                accent="#2e7d32"
              >
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                        {t("map.page.condos.showLabel")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("map.page.condos.showDescription")}
                      </Typography>
                    </Box>
                    <Switch
                      checked={showCondos}
                      onChange={(e) => setShowCondos(e.target.checked)}
                    />
                  </Stack>
                </Stack>
              </TrackingCard>

              <TrackingCard
                badge={{
                  text: showConstructionSites
                    ? t("map.page.toggle.on")
                    : t("map.page.toggle.off"),
                  color: showConstructionSites ? "success" : "default",
                }}
                title={t("map.page.sites.title")}
                subtitle={t("map.page.sites.subtitle")}
                line1Label={t("map.page.sites.visibleLabel")}
                line1Value={`${(constructionSitesRows ?? []).length}`}
                line2Label={t("map.page.sites.geocodedLabel")}
                line2Value={`${
                  (constructionSitesRows ?? []).filter((s: any) => {
                    const l = s.location?.trim();
                    if (!l || isProbablyDummy(l)) return false;
                    return Boolean(geoByText[normalizeLocationText(l)]);
                  }).length
                }`}
                bottomNote={t("map.page.sites.bottomNote")}
                accent="#ed6c02"
              >
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                        {t("map.page.sites.showLabel")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("map.page.sites.showDescription")}
                      </Typography>
                    </Box>
                    <Switch
                      checked={showConstructionSites}
                      onChange={(e) =>
                        setShowConstructionSites(e.target.checked)
                      }
                    />
                  </Stack>
                </Stack>
              </TrackingCard>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
