import type { LatLngExpression } from "leaflet";
import type { Point } from "..";

const ORS_BASE_URL =
  "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

export const MapApi = {
  getRoute: async (
    apiKey: string,
    start: Point,
    end: Point,
    signal?: AbortSignal
  ): Promise<LatLngExpression[] | null> => {
    const res = await fetch(ORS_BASE_URL, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        coordinates: [
          [start.lon, start.lat],
          [end.lon, end.lat],
        ],
      }),
    });

    if (!res.ok) return null;

    const geo = await res.json();

    const coords: [number, number][] | undefined =
      geo?.features?.[0]?.geometry?.coordinates;

    if (!coords?.length) return null;

    return coords.map(([lon, lat]) => [lat, lon]);
  },
};
