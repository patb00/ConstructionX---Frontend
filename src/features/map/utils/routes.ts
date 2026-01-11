import type { LatLngExpression } from "leaflet";
import type { Point } from "../types";

export async function fetchRouteORS(
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
