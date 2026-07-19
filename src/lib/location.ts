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

export function detectCoordinates(
  onSuccess: (coords: LatLng, source: 'browser' | 'ip') => void,
  onFailure: (error?: any) => void
) {
  if (typeof window === 'undefined') return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSuccess(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          'browser'
        );
      },
      (err) => {
        console.warn("Browser geolocation failed. Falling back to IP-based location:", err);
        getIPLocation()
          .then(({ coords }) => {
            onSuccess(coords, 'ip');
          })
          .catch((ipErr) => {
            console.error("All location detection sources failed:", ipErr);
            onFailure(ipErr);
          });
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  } else {
    getIPLocation()
      .then(({ coords }) => {
        onSuccess(coords, 'ip');
      })
      .catch(onFailure);
  }
}
