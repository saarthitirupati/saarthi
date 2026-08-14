/**
 * Calculates the geodesic distance (in kilometers) between two coordinates
 * using the Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  
  return d; // Return raw value for nesting math
}

/**
 * Calculates a realistic driving distance by applying origin-aware road routing factors.
 * - Handles Tirupati Foothill <-> Tirumala Hill Ghat Road (~22-25 km)
 * - Handles local Tirumala hill routes (~0.1 km - 3 km)
 * - Handles local Tirupati town routes
 */
export function calculateDrivingDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  isTirumalaSpot: boolean = false
): number {
  const rawDist = calculateDistance(lat1, lon1, lat2, lon2);

  // Tirumala Main Temple Square anchor: 13.68323, 79.34731
  const TIRUMALA_SQUARE = { lat: 13.68323, lng: 79.34731 };

  // Determine if origin & destination are on Tirumala hill (lat >= 13.66)
  const isOriginOnHill = lat1 >= 13.66;
  const isDestOnHill = isTirumalaSpot || lat2 >= 13.66;

  // Case 1: Both Origin & Destination are on Tirumala Hill
  if (isOriginOnHill && isDestOnHill) {
    // Local hill travel along winding mountain roads
    const hillFactor = rawDist < 1 ? 1.4 : 1.35;
    return Number(Math.max(0.1, rawDist * hillFactor).toFixed(1));
  }

  // Case 2: Origin is Foothill (Tirupati) & Destination is Hill (Tirumala) OR vice-versa
  if ((!isOriginOnHill && isDestOnHill) || (isOriginOnHill && !isDestOnHill)) {
    // Base Ghat road transit distance from Tirupati foothill to Tirumala Main Temple Square (~21.5 km)
    const baseFoothillDist = calculateDistance(lat1, lon1, TIRUMALA_SQUARE.lat, TIRUMALA_SQUARE.lng);
    const baseGhatDist = Math.max(21.5, baseFoothillDist * 1.55);

    // Calculate local hill distance from Tirumala Temple Square to the destination landmark
    const localHillRaw = calculateDistance(TIRUMALA_SQUARE.lat, TIRUMALA_SQUARE.lng, lat2, lon2);
    
    // For spots further north on Papavanasam Road (lat2 > 13.685), apply hill road multiplier
    let localHillOffset = 0;
    if (localHillRaw > 0.3) {
      const windingFactor = lat2 > 13.685 ? 1.75 : 1.3;
      localHillOffset = localHillRaw * windingFactor;
    }

    const totalDistance = baseGhatDist + localHillOffset;
    return Number(totalDistance.toFixed(1));
  }

  // Case 3: Both Origin & Destination are in Tirupati Foothills / City Center
  let factor = 1.25;
  if (rawDist < 2.5) {
    factor = 2.3;
  } else if (rawDist < 8.0) {
    factor = 1.85;
  } else if (rawDist < 25.0) {
    factor = 1.45;
  }

  return Number(Math.max(0.1, rawDist * factor).toFixed(1));
}

/**
 * Fallback Tirupati center coordinates
 */
export const TIRUPATI_CENTER = {
  lat: 13.6288,
  lng: 79.4192,
};

/**
 * OSRM Real Road Distance Helper:
 * Fetches real driving distance (in km) and travel duration (in mins) via OpenStreetMap OSRM routing API.
 */
export async function getOsrmRoadRoute(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<{ distanceKm: number; durationMins: number; source: 'osrm' | 'fallback' }> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data?.routes?.[0]) {
        const route = data.routes[0];
        const distanceKm = Number((route.distance / 1000).toFixed(1));
        const durationMins = Math.max(1, Math.round(route.duration / 60));
        return { distanceKm, durationMins, source: 'osrm' };
      }
    }
  } catch (_e) {
    // Fallback if offline or timeout
  }

  const fallbackDist = calculateDrivingDistance(lat1, lon1, lat2, lon2);
  const fallbackTime = Math.max(3, Math.round(fallbackDist * 2.2));
  return { distanceKm: fallbackDist, durationMins: fallbackTime, source: 'fallback' };
}

