import type { Point } from "..";

type LatLon = [number, number];

const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

export const MapApi = {
  getRoute: async (
    _apiKey: string | undefined,
    start: Point,
    end: Point,
    signal?: AbortSignal,
  ): Promise<LatLon[] | null> => {
    const startStr = `${start.lon},${start.lat}`;
    const endStr = `${end.lon},${end.lat}`;

    const url = `${OSRM_BASE_URL}/${startStr};${endStr}?overview=full&geometries=geojson`;

    try {
      const res = await fetch(url, {
        signal,
      });

      if (!res.ok) return null;

      const json = await res.json();

      const coords: [number, number][] | undefined =
        json?.routes?.[0]?.geometry?.coordinates;

      if (!coords?.length) return null;

      return coords.map(([lon, lat]) => [lat, lon]);
    } catch (e) {
      console.error("Routing error:", e);
      return null;
    }
  },
};
