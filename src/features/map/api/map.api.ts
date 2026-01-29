import type { Point } from "..";

// LatLngExpression in Leaflet was LatLng | LatLngLiteral | [number, number]
// For our purposes [number, number] (lat, lon) is fine.
type LatLon = [number, number];

const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

export const MapApi = {
  getRoute: async (
    _apiKey: string | undefined, // Ignored for OSRM public demo
    start: Point,
    end: Point,
    signal?: AbortSignal
  ): Promise<LatLon[] | null> => {
    // OSRM expects {lon},{lat}
    const startStr = `${start.lon},${start.lat}`;
    const endStr = `${end.lon},${end.lat}`;
    
    const url = `${OSRM_BASE_URL}/${startStr};${endStr}?overview=full&geometries=geojson`;

    try {
      const res = await fetch(url, {
        signal,
      });

      if (!res.ok) return null;

      const json = await res.json();
      
      // OSRM response structure: { routes: [ { geometry: { coordinates: [[lon, lat], ...] } } ] }
      const coords: [number, number][] | undefined = json?.routes?.[0]?.geometry?.coordinates;

      if (!coords?.length) return null;

      // Convert [lon, lat] back to [lat, lon] for consistency with previous return type
      return coords.map(([lon, lat]) => [lat, lon]);
    } catch (e) {
      console.error("Routing error:", e);
      return null;
    }
  },
};
