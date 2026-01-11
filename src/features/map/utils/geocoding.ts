import type { GeoCache, Point } from "..";

const GEO_CACHE_KEY = "ors_geocode_cache_v1";

export function loadGeoCache(): GeoCache {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as GeoCache;
  } catch {
    return {};
  }
}

export function saveGeoCache(cache: GeoCache) {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

export function normalizeLocationText(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

export function isProbablyDummy(text: string) {
  const t = text.trim().toLowerCase();
  if (!t) return true;
  if (t === "test") return true;
  if (/^\d+$/.test(t)) return true;
  if (t.startsWith("lokacija")) return true;
  return false;
}

export async function geocodeORS(
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
