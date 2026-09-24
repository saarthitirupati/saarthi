import { 
  calculateDistance, 
  calculateDrivingDistance, 
  getOsrmRoadRoute, 
  isCoordinateOnTirumalaHill,
  isWithinTirupatiRegion,
  formatTravelTime,
  formatDistance,
  estimateDriveDuration,
  isValidCoordinates,
  resolveLocationName,
  ALIPIRI_GATE,
  TIRUMALA_CENTER,
  TIRUPATI_CENTER,
  PRESET_LOCATIONS,
  type LocationOption
} from '@/utils/location';

export { 
  calculateDistance, 
  calculateDrivingDistance, 
  getOsrmRoadRoute, 
  isCoordinateOnTirumalaHill,
  isWithinTirupatiRegion,
  formatTravelTime,
  formatDistance,
  estimateDriveDuration,
  isValidCoordinates,
  resolveLocationName,
  ALIPIRI_GATE,
  TIRUMALA_CENTER,
  TIRUPATI_CENTER,
  PRESET_LOCATIONS,
  type LocationOption
};

export interface LatLng {
  lat: number;
  lng: number;
}

export type LocationSource = 'gps' | 'ip' | 'fallback' | 'manual';

export interface LocationResult {
  coords: LatLng;
  source: LocationSource;
  accuracyMeters?: number;
  isApproximate: boolean;
}


export async function getIPLocation(): Promise<{ coords: LatLng; city?: string }> {
  const fetchWithTimeout = async (url: string, timeoutMs: number = 2500) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  };

  // Try ipapi.co first
  try {
    const res = await fetchWithTimeout('https://ipapi.co/json/', 2500);
    if (res.ok) {
      const data = await res.json();
      if (data && isValidCoordinates(data.latitude, data.longitude)) {
        return {
          coords: { lat: Number(data.latitude.toFixed(6)), lng: Number(data.longitude.toFixed(6)) },
          city: data.city || undefined
        };
      }
    }
  } catch (e) {
    console.warn("ipapi.co fetch failed, trying ipinfo.io:", e);
  }

  // Try ipinfo.io as secondary fallback
  try {
    const res = await fetchWithTimeout('https://ipinfo.io/json', 2500);
    if (res.ok) {
      const data = await res.json();
      if (data && data.loc) {
        const [lat, lng] = data.loc.split(',').map(Number);
        if (isValidCoordinates(lat, lng)) {
          return {
            coords: { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) },
            city: data.city || undefined
          };
        }
      }
    }
  } catch (e) {
    console.warn("ipinfo.io fetch failed:", e);
  }

  return { coords: TIRUPATI_CENTER };
}

export async function reverseGeocodeCity(lat: number, lng: number): Promise<string | null> {
  if (!isValidCoordinates(lat, lng)) return null;
  if (isCoordinateOnTirumalaHill(lat, lng)) return 'Tirumala';
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      return data.city || data.locality || data.principalSubdivision || null;
    }
  } catch {}
  return null;
}

/**
 * Syncs the current user location to the browser's Cache API ('saarthi-user-context').
 * This allows the Service Worker (sw.js) to deliver location-accurate notifications
 * directly to mobile devices matching their exact current area (Tirumala, Tirupati, Alipiri, etc.).
 */
export function syncLocationToServiceWorker(coords: LatLng, locationName?: string) {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const region = locationName || resolveLocationName(coords.lat, coords.lng);
    caches.open('saarthi-user-context').then((cache) => {
      cache.put(
        '/user-location',
        new Response(
          JSON.stringify({
            lat: coords.lat,
            lng: coords.lng,
            locationName: region,
            updatedAt: Date.now()
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      ).catch(() => {});
    }).catch(() => {});
  } catch {}
}

/**
 * Detects user's real-time location with strict fresh GPS accuracy validation.
 * 
 * Pipeline:
 * 1. High Accuracy Hardware GPS (maximumAge: 0 forces fresh satellite/wifi fix, 15s timeout for prompt)
 * 2. Standard Accuracy Network Geolocation Fallback
 * 3. Coarse IP Location (marked as isApproximate = true)
 * 4. Default Tirupati Center Fallback
 */
export function detectCoordinates(
  onSuccess: (coords: LatLng, source?: LocationSource, isApproximate?: boolean, accuracyMeters?: number) => void,
  onFailure?: (error?: any) => void
) {
  if (typeof window === 'undefined') return;

  if (navigator.geolocation) {
    let resolved = false;

    const handleSuccess = (position: GeolocationPosition, source: LocationSource = 'gps') => {
      if (resolved) return;
      resolved = true;

      const lat = Number(position.coords.latitude.toFixed(6));
      const lng = Number(position.coords.longitude.toFixed(6));
      const accuracy = Math.round(position.coords.accuracy || 0);

      if (!isValidCoordinates(lat, lng)) {
        fallbackToIP();
        return;
      }

      const isPrecise = accuracy > 0 && accuracy <= 150;
      console.log(`[LocationPipeline] GPS acquired: (${lat}, ${lng}), accuracy: ±${accuracy}m`);

      syncLocationToServiceWorker({ lat, lng });
      onSuccess({ lat, lng }, source, !isPrecise, accuracy);
    };

    // Stage 1: Fast high-accuracy fix (accepts recent cache up to 60s, 6s timeout)
    navigator.geolocation.getCurrentPosition(
      (pos) => handleSuccess(pos, 'gps'),
      (firstErr) => {
        if (resolved) return;
        if (firstErr && firstErr.code === 1) {
          console.warn("[LocationPipeline] Geolocation permission denied by user, falling back to IP estimation.");
          fallbackToIP();
          return;
        }

        console.warn("[LocationPipeline] High accuracy GPS failed/timed out, attempting standard accuracy fallback:", firstErr);
        // Stage 2: Standard network accuracy fallback (cached up to 5 min, 5s timeout, works indoors)
        navigator.geolocation.getCurrentPosition(
          (stdPos) => handleSuccess(stdPos, 'gps'),
          (stdErr) => {
            if (resolved) return;
            console.warn("[LocationPipeline] Geolocation fallback triggered:", stdErr);
            fallbackToIP();
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
        );
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 }
    );
  } else {
    fallbackToIP();
  }

  function fallbackToIP() {
    console.log("[LocationPipeline] Falling back to IP-based location estimation...");
    getIPLocation()
      .then(({ coords }) => {
        console.log(`[LocationPipeline] IP Location acquired: (${coords.lat}, ${coords.lng})`);
        syncLocationToServiceWorker(coords);
        onSuccess(coords, 'ip', true);
      })
      .catch((err) => {
        console.warn("[LocationPipeline] IP location failed, using default Tirupati center:", err);
        syncLocationToServiceWorker(TIRUPATI_CENTER, 'Tirupati');
        onSuccess(TIRUPATI_CENTER, 'fallback', true);
        if (onFailure) onFailure(err);
      });
  }
}

/**
 * Watches real-time GPS coordinates updates as the user moves, updating on physical movement (>= 5m)
 * or when GPS satellite accuracy refines.
 */
export function watchCoordinates(
  onUpdate: (coords: LatLng, accuracyMeters?: number) => void
): number | null {
  if (typeof window === 'undefined' || !navigator.geolocation) return null;

  let lastCoords: LatLng | null = null;
  let bestAccuracy = Infinity;

  return navigator.geolocation.watchPosition(
    (position) => {
      const lat = Number(position.coords.latitude.toFixed(6));
      const lng = Number(position.coords.longitude.toFixed(6));
      const accuracy = Math.round(position.coords.accuracy || 0);

      if (!isValidCoordinates(lat, lng)) return;

      let shouldUpdate = false;
      if (!lastCoords) {
        shouldUpdate = true;
      } else {
        const dLat = Math.abs(lat - lastCoords.lat) * 111000;
        const dLng = Math.abs(lng - lastCoords.lng) * 111000 * Math.cos((lat * Math.PI) / 180);
        const distMovedMeters = Math.sqrt(dLat * dLat + dLng * dLng);

        // 1. Position shift of 5 or more meters
        if (distMovedMeters >= 5) {
          shouldUpdate = true;
        }
        // 2. Or GPS satellite lock refined accuracy significantly
        else if (accuracy > 0 && accuracy < bestAccuracy - 10) {
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        if (accuracy > 0 && accuracy < bestAccuracy) {
          bestAccuracy = accuracy;
        }
        lastCoords = { lat, lng };
        syncLocationToServiceWorker({ lat, lng });
        onUpdate({ lat, lng }, accuracy);
      }
    },
    (err) => console.warn("[LocationPipeline] GPS watch position error:", err),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
  );
}

/**
 * Place Intelligence Verification Engine:
 * Ranks nearby candidates based on entrance/parking proximity and confidence score.
 */
export function findNearestPlaceCandidates<T extends { coordinates: { lat: number; lng: number; primaryEntrance?: { lat: number; lng: number }; entrance?: { lat: number; lng: number } }; saarthiIntelligence?: { confidence?: number } }>(
  userCoords: LatLng,
  places: T[],
  maxRadiusMeters: number = 2000
): { place: T; distanceMeters: number; confidenceScore: number }[] {
  if (!isValidCoordinates(userCoords.lat, userCoords.lng)) return [];

  const candidates = places.map((place) => {
    const targetLat = place.coordinates.primaryEntrance?.lat ?? place.coordinates.entrance?.lat ?? place.coordinates.lat;
    const targetLng = place.coordinates.primaryEntrance?.lng ?? place.coordinates.entrance?.lng ?? place.coordinates.lng;

    const dLat = (targetLat - userCoords.lat) * 111000;
    const dLng = (targetLng - userCoords.lng) * 111000 * Math.cos((userCoords.lat * Math.PI) / 180);
    const distanceMeters = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));

    const confidenceScore = place.saarthiIntelligence?.confidence ?? 100;

    return { place, distanceMeters, confidenceScore };
  });

  return candidates
    .filter((c) => c.distanceMeters <= maxRadiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}


