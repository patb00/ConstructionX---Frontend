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

import { useVehicleBusinessTrips } from "../../vehicle_business_trips/hooks/useVehicleBusinessTrips";
import { useVehicleBusinessTripsByVehicle } from "../../vehicle_business_trips/hooks/useVehicleBusinessTripsByVehicle";
import { useVehicleBusinessTripsByEmployee } from "../../vehicle_business_trips/hooks/useVehicleBusinessTripsByEmployee";
import { useCondos } from "../../condos/hooks/useCondos";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";
import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import { TrackingCard } from "../../../components/TrackingCard";

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
  signal?: AbortSignal
): Promise<Point | null> {
  const query = `${text}, Croatia`;

  const url =
    "https://api.openrouteservice.org/geocode/search?" +
    new URLSearchParams({
      text: query,
      size: "1",
      boundary_country: "HR",
    }).toString();

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

export default function MapPage() {
  const ORS_KEY = import.meta.env.VITE_OPENROUTESERVICE_API_KEY as
    | string
    | undefined;

  const [mode, setMode] = useState<FilterMode>("all");
  const [vehicleId, setVehicleId] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number>(0);

  const [showCondos, setShowCondos] = useState(true);
  const [showTrips, setShowTrips] = useState(true);

  const allTripsQ = useVehicleBusinessTrips();
  const tripsByVehicleQ = useVehicleBusinessTripsByVehicle(vehicleId);
  const tripsByEmployeeQ = useVehicleBusinessTripsByEmployee(employeeId);

  const { condosRows } = useCondos();
  const { options: vehicleOptions } = useVehicleOptions();
  const { options: employeeOptions } = useEmployeeOptions();

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

      const nextCache = { ...cache };

      for (const text of texts) {
        if (ac.signal.aborted) return;
        if (nextCache[text]) continue;

        const p = await geocodeORS(ORS_KEY, text, ac.signal);
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
  }, [ORS_KEY, tripsRows, condos, showTrips, showCondos]);

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

  const modeBadge = useMemo(() => {
    if (mode === "all") return { text: "Live", color: "success" as const };
    if (mode === "vehicle")
      return { text: "Scoped", color: "warning" as const };
    return { text: "Scoped", color: "warning" as const };
  }, [mode]);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
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
                  <Marker key={`condo-${c.id}`} position={ll} icon={condoIcon}>
                    <Popup>
                      <div>
                        <div>
                          <b>Condo #{c.id}</b>
                        </div>
                        <div>{c.address}</div>
                        <div>
                          Occupied: {c.currentlyOccupied}/{c.capacity}
                        </div>
                        {c.responsibleEmployeeName && (
                          <div>Responsible: {c.responsibleEmployeeName}</div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
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
                    <Marker position={startLL} icon={tripIcon}>
                      <Popup>
                        Trip #{t.id} start: {t.startLocationText}
                      </Popup>
                    </Marker>

                    <Marker position={endLL} icon={tripIcon}>
                      <Popup>
                        Trip #{t.id} end: {t.endLocationText}
                      </Popup>
                    </Marker>

                    <Polyline positions={line} />
                  </div>
                );
              })}
          </MapContainer>
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

            borderLeft: { md: "1px solid" },
            borderColor: "divider",
          }}
        >
          <Stack sx={{ height: "100%", width: "100%" }}>
            <Stack
              spacing={1.25}
              sx={{
                p: 2,
                flex: 1,
                minHeight: 0,
                overflow: { xs: "visible", md: "auto" },
              }}
            >
              <TrackingCard
                badge={modeBadge}
                title={
                  mode === "all"
                    ? "All data"
                    : mode === "vehicle"
                    ? "Vehicle scope"
                    : "Employee scope"
                }
                subtitle="Map view scope"
                line1Label={mode === "vehicle" ? "Vehicle:" : "Mode:"}
                line1Value={
                  mode === "vehicle"
                    ? selectedVehicleLabel
                    : mode === "employee"
                    ? "Employee"
                    : "All"
                }
                line2Label={mode === "employee" ? "Employee:" : "Trips:"}
                line2Value={
                  mode === "employee"
                    ? selectedEmployeeLabel
                    : `Visible ${tripsRows.length}`
                }
                bottomNote={
                  mode === "all"
                    ? "Shows all condos + all trips"
                    : "Scoped views reduce clutter"
                }
                accent={mode === "all" ? "#2e7d32" : "#ed6c02"}
              >
                <FormControl fullWidth size="small">
                  <InputLabel id="mode-label">View</InputLabel>
                  <Select
                    labelId="mode-label"
                    value={mode}
                    label="View"
                    onChange={(e) => setMode(e.target.value as FilterMode)}
                  >
                    <MenuItem value="all">All condos + all trips</MenuItem>
                    <MenuItem value="vehicle">Trips by vehicle</MenuItem>
                    <MenuItem value="employee">Trips by employee</MenuItem>
                  </Select>
                </FormControl>

                {mode === "vehicle" && (
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
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
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
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
              </TrackingCard>

              <TrackingCard
                badge={{
                  text:
                    showCondos && showTrips
                      ? "Active"
                      : showCondos || showTrips
                      ? "Partial"
                      : "Off",
                  color:
                    showCondos && showTrips
                      ? "success"
                      : showCondos || showTrips
                      ? "warning"
                      : "default",
                }}
                title="Layers"
                subtitle="Visibility toggles"
                line1Label="Condos:"
                line1Value={showCondos ? "On" : "Off"}
                line2Label="Trips:"
                line2Value={showTrips ? "On" : "Off"}
                bottomNote="These also control routing/geocoding work"
                accent="#1976d2"
              >
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                        Condos
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Show condo markers
                      </Typography>
                    </Box>
                    <Switch
                      checked={showCondos}
                      onChange={(e) => setShowCondos(e.target.checked)}
                    />
                  </Stack>

                  <Divider />

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                        Trips
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Show trip routes & markers
                      </Typography>
                    </Box>
                    <Switch
                      checked={showTrips}
                      onChange={(e) => setShowTrips(e.target.checked)}
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
