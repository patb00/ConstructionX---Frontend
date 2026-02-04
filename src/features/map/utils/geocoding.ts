import type { GeoCache, Point } from "..";

const GEO_CACHE_KEY = "ors_geocode_cache_v7"; // Bumped version for Fallback logic (retry)

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

// Reverted to original simple implementation as requested.
// Removed tryGeocode and fallback logic which caused 0 results.

export async function geocodePhoton(
  text: string,
  signal?: AbortSignal
): Promise<Point | null> {
  const doFetch = async (query: string): Promise<Point | null> => {
     try {
        const params = new URLSearchParams({ q: query, limit: "1" });
        const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, { signal });
        if (!res.ok) return null;
        const data = await res.json();
        const first = data?.features?.[0];
        if (first && first.geometry && first.geometry.coordinates) {
          const [lon, lat] = first.geometry.coordinates;
          return { lat, lon };
        }
        return null;
     } catch { return null; }
  };

  try {
    // 1. Primary Attempt: Full address + Country bias
    let query = text;
    const lower = query.toLowerCase();
    if (!lower.includes("hrvatska") && !lower.includes("croatia")) {
      query += ", Hrvatska";
    }
    
    let result = await doFetch(query);
    if (result) return result;

    // 2. Fallback Attempt: Extract City/Place from comma-separated string
    // e.g. "Radnički smještaj, A1, Zagreb" -> "Zagreb, Hrvatska"
    if (text.includes(",")) {
        const parts = text.split(",").map(p => p.trim()).filter(p => p.length > 0);
        
        // If we have parts, try the last one (usually city)
        if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            
            // Avoid re-querying if the last part is just "Hrvatska"
            if (lastPart.toLowerCase() !== "hrvatska" && lastPart.toLowerCase() !== "croatia") {
                 let fallbackQuery = lastPart;
                 if (!fallbackQuery.toLowerCase().includes("hrvatska")) {
                     fallbackQuery += ", Hrvatska";
                 }
                 result = await doFetch(fallbackQuery);
                 if (result) return result;
            } else if (parts.length > 1) {
                // If last part IS Hrvatska, take the one before it: "Zagreb, Hrvatska" -> "Zagreb"
                // But usually we want to try the specific address first (which we did).
                // If "Ilica 1, Zagreb, Hrvatska" failed, maybe "Zagreb, Hrvatska" will work?
                const secondLast = parts[parts.length - 2];
                let fallbackQuery = secondLast;
                 if (!fallbackQuery.toLowerCase().includes("hrvatska")) {
                     fallbackQuery += ", Hrvatska";
                 }
                 result = await doFetch(fallbackQuery);
                 if (result) return result;
            }
        }
    }

    return null;
  } catch (e) {
    console.error("Geocode error:", e);
    return null;
  }
}

// Keep compatible signature if needed, or better yet, we update the caller.
// We will update the caller (MapPage) to use geocodePhoton.


// Keep signature compatible but ignore apiKey
export async function geocodeORS(
  _apiKey: string | undefined, // ignored
  text: string,
  signal?: AbortSignal,
  _opts?: { boundaryCountry?: string; suffix?: string } // ignored for now, hardcoded to HR in Nominatim impl
): Promise<Point | null> {
  // Redirect to Photon
  return geocodePhoton(text, signal);
}
