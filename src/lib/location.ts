import { 
  calculateDistance, 
  calculateDrivingDistance, 
  getOsrmRoadRoute, 
  isCoordinateOnTirumalaHill,
  isPlaceOnTirumala,
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
  isPlaceOnTirumala,
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
    let hasGps = false;

    const handleSuccess = (position: GeolocationPosition) => {
      hasGps = true;
      const lat = Number(position.coords.latitude.toFixed(6));
      const lng = Number(position.coords.longitude.toFixed(6));
      const accuracy = Math.round(position.coords.accuracy || 0);

      if (!isValidCoordinates(lat, lng)) {
        fallbackToDefault();
        return;
      }

      const isPrecise = accuracy > 0 && accuracy <= 100;
      console.log(`[LocationPipeline] High-accuracy GPS acquired: (${lat}, ${lng}), accuracy: ±${accuracy}m`);

      syncLocationToServiceWorker({ lat, lng });
      onSuccess({ lat, lng }, 'gps', !isPrecise, accuracy);
    };

    // Parallel fallback timer: waits for hardware GPS fix before falling back
    const fallbackTimer = setTimeout(() => {
      if (!hasGps) {
        fallbackToDefault();
      }
    }, 4500);

    // Single high-accuracy hardware/satellite GPS query with fast 4.5s timeout
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(fallbackTimer);
        handleSuccess(pos);
      },
      (err) => {
        clearTimeout(fallbackTimer);
        if (err && err.code === 1) {
          console.warn("[LocationPipeline] Geolocation permission denied by user.");
          if (onFailure) onFailure(err);
          return;
        }
        fallbackToDefault(err);
      },
      { enableHighAccuracy: true, timeout: 4500, maximumAge: 60000 }
    );
  } else {
    fallbackToDefault();
  }

  function fallbackToDefault(error?: any) {
    getIPLocation()
      .then(({ coords, city }) => {
        // Only trust IP if within Tirupati pilgrimage region; otherwise use verified Tirupati center
        const isNearTirupati = isWithinTirupatiRegion(coords.lat, coords.lng);
        const chosenCoords = isNearTirupati ? coords : TIRUPATI_CENTER;
        const source: LocationSource = isNearTirupati ? 'ip' : 'fallback';

        console.log(`[LocationPipeline] Regional fallback location set: (${chosenCoords.lat}, ${chosenCoords.lng}) via ${source}`);
        syncLocationToServiceWorker(chosenCoords, city);
        onSuccess(chosenCoords, source, true);
      })
      .catch((err) => {
        console.warn("[LocationPipeline] Fallback to verified Tirupati center:", err);
        syncLocationToServiceWorker(TIRUPATI_CENTER, 'Tirupati');
        onSuccess(TIRUPATI_CENTER, 'fallback', true);
        if (onFailure) onFailure(error || err);
      });
  }
}

/**
 * Watches real-time GPS coordinates updates as the user moves, updating on physical movement (>= 3m)
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

        // Reject noisy cell-tower glitches (> 300m) if we already have a solid GPS fix (<= 60m)
        if (accuracy > 300 && bestAccuracy <= 60) {
          return;
        }

        // 1. Accuracy refined (satellite lock tightened)
        if (accuracy > 0 && accuracy < bestAccuracy) {
          shouldUpdate = true;
        }
        // 2. Physical movement of 3 or more meters with acceptable accuracy
        else if (distMovedMeters >= 3 && (accuracy <= 100 || accuracy <= bestAccuracy * 1.5)) {
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
    (err) => console.warn("[LocationPipeline] GPS watch position notice:", err),
    { enableHighAccuracy: true, maximumAge: 2000 }
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


