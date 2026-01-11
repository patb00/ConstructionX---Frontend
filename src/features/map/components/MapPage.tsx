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
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMapEvents } from "react-leaflet";
import { useVehicleBusinessTrips } from "../../vehicle_business_trips/hooks/useVehicleBusinessTrips";
import { useVehicleBusinessTripsByVehicle } from "../../vehicle_business_trips/hooks/useVehicleBusinessTripsByVehicle";
import { useVehicleBusinessTripsByEmployee } from "../../vehicle_business_trips/hooks/useVehicleBusinessTripsByEmployee";
import { useCondos } from "../../condos/hooks/useCondos";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";
import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import { TrackingCard } from "../../../components/TrackingCard";
import { useConstructionSites } from "../../construction_site/hooks/useConstructionSites";

type TripRow = {
  id: number;
  startLocationText: string | null;
  endLocationText: string | null;
  vehicleId?: number | null;
  employeeId?: number | null;
};

type CondoRow = {
  id: number;
  address: string | null;
  capacity: number;
  currentlyOccupied: number;
  responsibleEmployeeName?: string | null;
};

type Point = { lat: number; lon: number };

const tripIcon = L.divIcon({
  className: "marker-trip",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#1976d2;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const condoIcon = L.divIcon({
  className: "marker-condo",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#2e7d32;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const siteIcon = L.divIcon({
  className: "marker-site",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#ed6c02;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const GEO_CACHE_KEY = "ors_geocode_cache_v1";

function loadGeoCache(): Record<string, Point> {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Point>;
  } catch {
    return {};
  }
}

function saveGeoCache(cache: Record<string, Point>) {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function isProbablyDummy(text: string) {
  const t = text.trim().toLowerCase();
  if (!t) return true;
  if (t === "test") return true;
  if (/^\d+$/.test(t)) return true;
  if (t.startsWith("lokacija")) return true;
  return false;
}

async function geocodeORS(
  apiKey: string,
  text: string,
  signal?: AbortSignal,
  opts?: { boundaryCountry?: string; suffix?: string }
): Promise<Point | null> {
  const query = opts?.suffix ? `${text}, ${opts.suffix}` : text;

  const params = new URLSearchParams({
    text: query,
    size: "1",
  });

  if (opts?.boundaryCountry)
    params.set("boundary_country", opts.boundaryCountry);

  const url =
    "https://api.openrouteservice.org/geocode/search?" + params.toString();

  const res = await fetch(url, {
    signal,
    headers: { Authorization: apiKey, Accept: "application/json" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const coords: [number, number] | undefined =
    data?.features?.[0]?.geometry?.coordinates;
  if (!coords) return null;

  const [lon, lat] = coords;
  return { lat, lon };
}

async function fetchRouteORS(
  apiKey: string,
  start: Point,
  end: Point,
  signal?: AbortSignal
): Promise<LatLngExpression[] | null> {
  const res = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", Authorization: apiKey },
      body: JSON.stringify({
        coordinates: [
          [start.lon, start.lat],
          [end.lon, end.lat],
        ],
      }),
    }
  );

  if (!res.ok) return null;

  const geo = await res.json();
  const coords: [number, number][] | undefined =
    geo?.features?.[0]?.geometry?.coordinates;
  if (!coords?.length) return null;

  return coords.map(([lon, lat]) => [lat, lon]);
}

type FilterMode = "all" | "vehicle" | "employee";

type SelectedMarker =
  | { kind: "trip-start"; trip: TripRow }
  | { kind: "trip-end"; trip: TripRow }
  | { kind: "condo"; condo: CondoRow }
  | { kind: "site"; site: any };

function MapClickClearer(props: { onClear: () => void }) {
  useMapEvents({
    click: () => props.onClear(),
  });
  return null;
}

export default function MapPage() {
  const ORS_KEY = import.meta.env.VITE_OPENROUTESERVICE_API_KEY as
    | string
    | undefined;

  const [mode, setMode] = useState<FilterMode>("all");
  const [vehicleId, setVehicleId] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number>(0);

  const [showCondos, setShowCondos] = useState(true);
  const [showTrips, setShowTrips] = useState(true);
  const [showConstructionSites, setShowConstructionSites] = useState(true);

  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(
    null
  );

  const allTripsQ = useVehicleBusinessTrips();
  const tripsByVehicleQ = useVehicleBusinessTripsByVehicle(vehicleId);
  const tripsByEmployeeQ = useVehicleBusinessTripsByEmployee(employeeId);

  const { condosRows } = useCondos();
  const { options: vehicleOptions } = useVehicleOptions();
  const { options: employeeOptions } = useEmployeeOptions();
  const { constructionSitesRows } = useConstructionSites({
    statusOptions: [],
    employeeOptions: [],
    toolOptions: [],
    vehicleOptions: [],
  });

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
    [condosRows]
  );

  const selectedVehicleLabel =
    vehicleOptions.find((o) => o.value === vehicleId)?.label ?? "—";
  const selectedEmployeeLabel =
    employeeOptions.find((o) => o.value === employeeId)?.label ?? "—";

  const [geoByText, setGeoByText] = useState<Record<string, Point>>({});
  const [routeByTripId, setRouteByTripId] = useState<
    Record<number, LatLngExpression[]>
  >({});

  useEffect(() => {
    const ac = new AbortController();

    async function run() {
      if (!ORS_KEY) return;

      const cache = loadGeoCache();
      setGeoByText(cache);

      const texts = new Set<string>();

      if (showTrips) {
        for (const t of tripsRows) {
          const s = t.startLocationText?.trim();
          const e = t.endLocationText?.trim();
          if (s && !isProbablyDummy(s)) texts.add(normalize(s));
          if (e && !isProbablyDummy(e)) texts.add(normalize(e));
        }
      }

      if (showCondos) {
        for (const c of condos) {
          const a = c.address?.trim();
          if (a && !isProbablyDummy(a)) texts.add(normalize(a));
        }
      }

      if (showConstructionSites) {
        for (const s of constructionSitesRows ?? []) {
          const loc = (s as any)?.location?.trim();
          if (loc && !isProbablyDummy(loc)) texts.add(normalize(loc));
        }
      }

      const nextCache = { ...cache };

      for (const text of texts) {
        if (ac.signal.aborted) return;
        if (nextCache[text]) continue;

        let p = await geocodeORS(ORS_KEY, text, ac.signal, {
          boundaryCountry: "HR",
          suffix: "Croatia",
        });

        if (!p) {
          p = await geocodeORS(ORS_KEY, text, ac.signal);
        }
        if (p) {
          nextCache[text] = p;
          saveGeoCache(nextCache);
          setGeoByText({ ...nextCache });
        }
      }

      const nextRoutes: Record<number, LatLngExpression[]> = {};
      if (showTrips) {
        for (const t of tripsRows) {
          if (ac.signal.aborted) return;

          const sRaw = t.startLocationText?.trim();
          const eRaw = t.endLocationText?.trim();
          if (!sRaw || !eRaw) continue;
          if (isProbablyDummy(sRaw) || isProbablyDummy(eRaw)) continue;

          const s = normalize(sRaw);
          const e = normalize(eRaw);

          const start = nextCache[s];
          const end = nextCache[e];
          if (!start || !end) continue;

          const route = await fetchRouteORS(ORS_KEY, start, end, ac.signal);
          if (route) nextRoutes[t.id] = route;
        }
      }

      setRouteByTripId(nextRoutes);
    }

    run().catch(() => {});
    return () => ac.abort();
  }, [
    ORS_KEY,
    tripsRows,
    condos,
    constructionSitesRows,
    showTrips,
    showCondos,
    showConstructionSites,
  ]);

  const center: LatLngExpression = [45.815, 15.9819];

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

  console.log("constructionSitesRows", constructionSitesRows);

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
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickClearer onClear={() => setSelectedMarker(null)} />

            {!ORS_KEY && (
              <Marker position={center}>
                <Popup>
                  Missing ORS key. Add <b>VITE_OPENROUTESERVICE_API_KEY</b> to{" "}
                  <b>.env</b> and restart.
                </Popup>
              </Marker>
            )}

            {showCondos &&
              condos.map((c) => {
                const addrRaw = c.address?.trim();
                if (!addrRaw || isProbablyDummy(addrRaw)) return null;
                const addr = normalize(addrRaw);

                const p = geoByText[addr];
                if (!p) return null;

                const ll: LatLngExpression = [p.lat, p.lon];

                return (
                  <Marker
                    key={`condo-${c.id}`}
                    position={ll}
                    icon={condoIcon}
                    eventHandlers={{
                      click: () =>
                        setSelectedMarker({ kind: "condo", condo: c }),
                    }}
                  />
                );
              })}

            {showTrips &&
              tripsRows.map((t) => {
                const sRaw = t.startLocationText?.trim();
                const eRaw = t.endLocationText?.trim();
                if (!sRaw || !eRaw) return null;
                if (isProbablyDummy(sRaw) || isProbablyDummy(eRaw)) return null;

                const s = normalize(sRaw);
                const e = normalize(eRaw);

                const start = geoByText[s];
                const end = geoByText[e];
                if (!start || !end) return null;

                const startLL: LatLngExpression = [start.lat, start.lon];
                const endLL: LatLngExpression = [end.lat, end.lon];

                const route = routeByTripId[t.id];
                const line: LatLngExpression[] = route ?? [startLL, endLL];

                return (
                  <div key={`trip-${t.id}`}>
                    <Marker
                      position={startLL}
                      icon={tripIcon}
                      eventHandlers={{
                        click: () =>
                          setSelectedMarker({ kind: "trip-start", trip: t }),
                      }}
                    />

                    <Marker
                      position={endLL}
                      icon={tripIcon}
                      eventHandlers={{
                        click: () =>
                          setSelectedMarker({ kind: "trip-end", trip: t }),
                      }}
                    />

                    <Polyline positions={line} />
                  </div>
                );
              })}

            {showConstructionSites &&
              (constructionSitesRows ?? []).map((s: any) => {
                const locRaw = s.location?.trim();
                if (!locRaw || isProbablyDummy(locRaw)) return null;

                const loc = normalize(locRaw);
                const p = geoByText[loc];
                if (!p) return null;

                const ll: LatLngExpression = [p.lat, p.lon];

                return (
                  <Marker
                    key={`site-${s.id}`}
                    position={ll}
                    icon={siteIcon}
                    eventHandlers={{
                      click: () => setSelectedMarker({ kind: "site", site: s }),
                    }}
                  />
                );
              })}
          </MapContainer>

          {selectedMarker && (
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

                <IconButton
                  onClick={() => setSelectedMarker(null)}
                  size="small"
                >
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
          )}
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
                  text: showTrips ? "On" : "Off",
                  color: showTrips ? "success" : "default",
                }}
                title="Trips"
                subtitle="Scope + visibility"
                line1Label="Scope:"
                line1Value={
                  mode === "all"
                    ? "All"
                    : mode === "vehicle"
                    ? "Vehicle"
                    : "Employee"
                }
                line2Label="Visible:"
                line2Value={`${tripsRows.length}`}
                bottomNote={
                  mode === "vehicle"
                    ? `Vehicle: ${selectedVehicleLabel}`
                    : mode === "employee"
                    ? `Employee: ${selectedEmployeeLabel}`
                    : "Showing trips from all sources"
                }
                accent="#1976d2"
              >
                <Stack spacing={1}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="mode-label">Scope</InputLabel>
                    <Select
                      labelId="mode-label"
                      value={mode}
                      label="Scope"
                      onChange={(e) => setMode(e.target.value as FilterMode)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="vehicle">Vehicle</MenuItem>
                      <MenuItem value="employee">Employee</MenuItem>
                    </Select>
                  </FormControl>

                  {mode === "vehicle" && (
                    <FormControl fullWidth size="small">
                      <InputLabel id="vehicle-label">Vehicle</InputLabel>
                      <Select
                        labelId="vehicle-label"
                        value={vehicleId}
                        label="Vehicle"
                        onChange={(e) => setVehicleId(Number(e.target.value))}
                        sx={{
                          "& .MuiSelect-select": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      >
                        <MenuItem value={0}>Select vehicle…</MenuItem>
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
                      <InputLabel id="employee-label">Employee</InputLabel>
                      <Select
                        labelId="employee-label"
                        value={employeeId}
                        label="Employee"
                        onChange={(e) => setEmployeeId(Number(e.target.value))}
                        sx={{
                          "& .MuiSelect-select": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      >
                        <MenuItem value={0}>Select employee…</MenuItem>
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
                        Show trips
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Routes and markers
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
                  text: showCondos ? "On" : "Off",
                  color: showCondos ? "success" : "default",
                }}
                title="Condos"
                subtitle="Visibility"
                line1Label="Visible:"
                line1Value={`${condos.length}`}
                line2Label="Geocoded:"
                line2Value={`${
                  condos.filter((c) => {
                    const a = c.address?.trim();
                    if (!a || isProbablyDummy(a)) return false;
                    return Boolean(geoByText[normalize(a)]);
                  }).length
                }`}
                bottomNote="Addresses are geocoded and cached in the browser"
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
                        Show condos
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Condo markers
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
                  text: showConstructionSites ? "On" : "Off",
                  color: showConstructionSites ? "success" : "default",
                }}
                title="Construction sites"
                subtitle="Visibility"
                line1Label="Visible:"
                line1Value={`${(constructionSitesRows ?? []).length}`}
                line2Label="Geocoded:"
                line2Value={`${
                  (constructionSitesRows ?? []).filter((s: any) => {
                    const l = s.location?.trim();
                    if (!l || isProbablyDummy(l)) return false;
                    return Boolean(geoByText[normalize(l)]);
                  }).length
                }`}
                bottomNote="Locations are geocoded and cached in the browser"
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
                        Show sites
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Site markers
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
