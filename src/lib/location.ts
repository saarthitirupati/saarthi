export const TIRUPATI_CENTER = { lat: 13.6288, lng: 79.4192 };

export interface LatLng {
  lat: number;
  lng: number;
}

export async function getIPLocation(): Promise<{ coords: LatLng; city?: string }> {
  // Try ipapi.co first
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        return {
          coords: { lat: data.latitude, lng: data.longitude },
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
        if (!isNaN(lat) && !isNaN(lng)) {
          return {
            coords: { lat, lng },
            city: data.city || undefined
          };
        }
      }
    }
  } catch (e) {
    console.warn("ipinfo.io fetch failed:", e);
  }

  // Return default if both failed
  return { coords: TIRUPATI_CENTER };
}

/**
 * Detects the user's exact real-time GPS coordinates.
 * Uses high-accuracy hardware GPS first, with automatic fallback to standard GPS, then IP location.
 */
export function detectCoordinates(
  onSuccess: (coords: LatLng, source: 'browser' | 'ip') => void,
  onFailure: (error?: any) => void
) {
  if (typeof window === 'undefined') return;

  if (navigator.geolocation) {
    // 1. Try High Accuracy Hardware GPS (enableHighAccuracy: true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSuccess(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          'browser'
        );
      },
      (highAccErr) => {
        console.warn("High accuracy GPS failed/timed out, trying standard accuracy:", highAccErr);
        // 2. Fallback to standard accuracy GPS
        navigator.geolocation.getCurrentPosition(
          (stdPosition) => {
            onSuccess(
              { lat: stdPosition.coords.latitude, lng: stdPosition.coords.longitude },
              'browser'
            );
          },
          (stdErr) => {
            console.warn("Standard geolocation failed, falling back to IP location:", stdErr);
            getIPLocation()
              .then(({ coords }) => {
                onSuccess(coords, 'ip');
              })
              .catch((ipErr) => {
                console.error("All location detection sources failed:", ipErr);
                onFailure(ipErr);
              });
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  } else {
    getIPLocation()
      .then(({ coords }) => {
        onSuccess(coords, 'ip');
      })
      .catch(onFailure);
  }
}

/**
 * Watches real-time GPS coordinates updates as the user moves.
 */
export function watchCoordinates(
  onUpdate: (coords: LatLng) => void
): number | null {
  if (typeof window === 'undefined' || !navigator.geolocation) return null;

  return navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({ lat: position.coords.latitude, lng: position.coords.longitude });
    },
    (err) => console.warn("GPS watch position error:", err),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
  );
}
