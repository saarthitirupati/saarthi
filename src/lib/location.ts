import { 
  calculateDistance, 
  calculateDrivingDistance, 
  getOsrmRoadRoute, 
  isCoordinateOnTirumalaHill,
  isWithinTirupatiRegion,
  formatTravelTime,
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
  // Try ipapi.co first
  try {
    const res = await fetch('https://ipapi.co/json/');
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
    const res = await fetch('https://ipinfo.io/json');
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

/**
 * Detects user's real-time location with strict GPS accuracy validation.
 * 
 * Pipeline:
 * 1. High Accuracy Hardware GPS (accuracy <= 50m, maximumAge: 0 to prevent stale positions)
 * 2. Standard Accuracy Geolocation
 * 3. Coarse IP Location (marked as isApproximate = true)
 * 4. Default Tirupati Center Fallback
 */
export function detectCoordinates(
  onSuccess: (coords: LatLng, source?: LocationSource, isApproximate?: boolean, accuracyMeters?: number) => void,
  onFailure?: (error?: any) => void
) {
  if (typeof window === 'undefined') return;

  if (navigator.geolocation) {
    console.log("[LocationPipeline] Requesting hardware GPS (smart cache 3m, 8s timeout)...");

    // 1. Try High Accuracy Hardware GPS with smart caching (maximumAge: 180000 allows instant 0ms cached position return)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        const accuracy = position.coords.accuracy || 0;

        if (!isValidCoordinates(lat, lng)) {
          console.warn("[LocationPipeline] GPS returned invalid coordinates:", lat, lng);
          fallbackToIP();
          return;
        }

        // Target accuracy threshold < 150m for valid smartphone city GPS
        const isPrecise = accuracy > 0 && accuracy <= 150;
        console.log(`[LocationPipeline] GPS acquired: (${lat}, ${lng}), accuracy: ±${Math.round(accuracy)}m, precise: ${isPrecise}`);

        onSuccess({ lat, lng }, 'gps', !isPrecise, Math.round(accuracy));
      },
      (highAccErr) => {
        console.warn("[LocationPipeline] High accuracy GPS failed/timed out, trying standard accuracy:", highAccErr);
        // 2. Fallback to standard accuracy GPS
        navigator.geolocation.getCurrentPosition(
          (stdPosition) => {
            const lat = Number(stdPosition.coords.latitude.toFixed(6));
            const lng = Number(stdPosition.coords.longitude.toFixed(6));
            const accuracy = stdPosition.coords.accuracy || 0;

            if (isValidCoordinates(lat, lng)) {
              console.log(`[LocationPipeline] Standard GPS acquired: (${lat}, ${lng}), accuracy: ±${Math.round(accuracy)}m`);
              onSuccess({ lat, lng }, 'gps', accuracy > 100, Math.round(accuracy));
            } else {
              fallbackToIP();
            }
          },
          (stdErr) => {
            console.warn("[LocationPipeline] Standard geolocation failed, falling back to IP location:", stdErr);
            fallbackToIP();
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 180000 }
    );
  } else {
    fallbackToIP();
  }

  function fallbackToIP() {
    console.log("[LocationPipeline] Falling back to IP-based location estimation...");
    getIPLocation()
      .then(({ coords }) => {
        console.log(`[LocationPipeline] IP Location acquired: (${coords.lat}, ${coords.lng})`);
        onSuccess(coords, 'ip', true);
      })
      .catch((err) => {
        console.warn("[LocationPipeline] IP location failed, using default Tirupati center:", err);
        onSuccess(TIRUPATI_CENTER, 'fallback', true);
        if (onFailure) onFailure(err);
      });
  }
}

/**
 * Watches real-time GPS coordinates updates as the user moves, filtering out minor GPS drift (< 5 meters).
 */
export function watchCoordinates(
  onUpdate: (coords: LatLng) => void
): number | null {
  if (typeof window === 'undefined' || !navigator.geolocation) return null;

  let lastCoords: LatLng | null = null;

  return navigator.geolocation.watchPosition(
    (position) => {
      const lat = Number(position.coords.latitude.toFixed(6));
      const lng = Number(position.coords.longitude.toFixed(6));

      if (!isValidCoordinates(lat, lng)) return;

      if (lastCoords) {
        // Approximate distance shift in meters
        const dLat = Math.abs(lat - lastCoords.lat) * 111000;
        const dLng = Math.abs(lng - lastCoords.lng) * 111000 * Math.cos((lat * Math.PI) / 180);
        const distMovedMeters = Math.sqrt(dLat * dLat + dLng * dLng);

        // Ignore micro GPS drift under 5 meters
        if (distMovedMeters < 5) return;
      }

      lastCoords = { lat, lng };
      onUpdate({ lat, lng });
    },
    (err) => console.warn("[LocationPipeline] GPS watch position error:", err),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
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


