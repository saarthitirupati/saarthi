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
/**
 * Helper to determine if coordinates are truly located on Tirumala Hill (Seshachalam Hills).
 * Tirumala Hill plateau is located north-west of Alipiri: lat >= 13.66 AND lng <= 79.385.
 * Locations with lng > 79.385 (like Karakambadi, Mangalam, Renigunta, Mallimadugu) are in the eastern plains.
 */
export function isCoordinateOnTirumalaHill(lat: number, lng: number): boolean {
  return lat >= 13.66 && lng <= 79.385;
}

/**
 * Alipiri Toll Gate / Ghat Road Entry Point
 * The single motorized gateway connecting Tirupati plains and Tirumala Hill.
 */
export const ALIPIRI_GATE = { lat: 13.647051, lng: 79.405856 };

/**
 * Tirumala Main Temple Square / Bus Station Anchor
 */
export const TIRUMALA_CENTER = { lat: 13.68323, lng: 79.34731 };

/**
 * Fallback Tirupati Central Railway Station / Bus Stand Anchor
 */
export const TIRUPATI_CENTER = { lat: 13.6288, lng: 79.4192 };

/**
 * Helper to check if a location is within the local Tirupati pilgrimage region (<= 80 km).
 */
export function isWithinTirupatiRegion(lat: number, lng: number): boolean {
  return calculateDistance(lat, lng, TIRUPATI_CENTER.lat, TIRUPATI_CENTER.lng) <= 80;
}

/**
 * Calculates a realistic driving distance by applying origin-aware road routing factors.
 * - Handles Tirupati Foothill <-> Tirumala Hill Ghat Road (~22-25 km via Alipiri Gate)
 * - Handles local Tirumala hill routes (~0.1 km - 5 km)
 * - Handles local Tirupati town and regional highway routes
 */
export function calculateDrivingDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  isTirumalaSpot: boolean = false
): number {
  const rawDist = calculateDistance(lat1, lon1, lat2, lon2);

  // Determine if origin & destination are on Tirumala hill
  const isOriginOnHill = isCoordinateOnTirumalaHill(lat1, lon1);
  const isDestOnHill = isTirumalaSpot || isCoordinateOnTirumalaHill(lat2, lon2);

  // ── CASE 1: Both Origin & Destination are on Tirumala Hill ──
  if (isOriginOnHill && isDestOnHill) {
    // Local hill travel along winding mountain roads
    const hillFactor = rawDist < 1.0 ? 1.35 : 1.45;
    return Number(Math.max(0.1, rawDist * hillFactor).toFixed(1));
  }

  // ── CASE 2: Origin is Plains & Destination is Tirumala Hill ──
  if (!isOriginOnHill && isDestOnHill) {
    // Step 1: Drive from Origin in plains to Alipiri Toll Gate
    const distToAlipiri = calculateDistance(lat1, lon1, ALIPIRI_GATE.lat, ALIPIRI_GATE.lng) * 1.25;
    // Step 2: Up-Ghat Road from Alipiri Gate to Tirumala Center (~18.5 km)
    const ghatRoadKm = 18.5;
    // Step 3: Local hill road from Tirumala Center to destination landmark
    const localHillRaw = calculateDistance(TIRUMALA_CENTER.lat, TIRUMALA_CENTER.lng, lat2, lon2);
    const localHillDist = localHillRaw > 0.2 ? localHillRaw * (lat2 > 13.685 ? 1.6 : 1.3) : 0;

    const totalDistance = distToAlipiri + ghatRoadKm + localHillDist;
    return Number(totalDistance.toFixed(1));
  }

  // ── CASE 3: Origin is Tirumala Hill & Destination is Plains ──
  if (isOriginOnHill && !isDestOnHill) {
    // Step 1: Local hill road from Origin on hill to Tirumala Center
    const localHillRaw = calculateDistance(lat1, lon1, TIRUMALA_CENTER.lat, TIRUMALA_CENTER.lng);
    const localHillDist = localHillRaw > 0.2 ? localHillRaw * (lat1 > 13.685 ? 1.6 : 1.3) : 0;
    // Step 2: Down-Ghat Road from Tirumala Center to Alipiri Gate (~19.5 km)
    const ghatRoadKm = 19.5;
    // Step 3: Drive from Alipiri Gate to destination in plains
    const distFromAlipiri = calculateDistance(ALIPIRI_GATE.lat, ALIPIRI_GATE.lng, lat2, lon2) * 1.25;

    const totalDistance = localHillDist + ghatRoadKm + distFromAlipiri;
    return Number(totalDistance.toFixed(1));
  }

  // ── CASE 4: Both Origin & Destination are in Plains (Tirupati, Renigunta, Chandragiri, etc.) ──
  let factor = 1.15;
  if (rawDist < 3.0) {
    factor = 1.30; // City street grid & turns
  } else if (rawDist < 12.0) {
    factor = 1.22; // Arterial town roads
  } else if (rawDist < 40.0) {
    factor = 1.16; // State highways
  }

  return Number(Math.max(0.1, rawDist * factor).toFixed(1));
}

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
  const fallbackTime = estimateDriveDuration(fallbackDist);
  return { distanceKm: fallbackDist, durationMins: fallbackTime, source: 'fallback' };
}

/**
 * Intelligent Drive Duration Estimator
 * Models city traffic (30 km/h), suburban transitions (40 km/h), regional highways (50-60 km/h), and Ghat roads.
 */
export function estimateDriveDuration(distanceKm: number, isTirumalaRoute: boolean = false): number {
  if (isTirumalaRoute) {
    return Math.max(5, Math.round(distanceKm * 2.1));
  }
  if (distanceKm <= 5) {
    return Math.max(2, Math.round(distanceKm * 2.0)); // City streets
  }
  if (distanceKm <= 20) {
    return Math.max(5, Math.round(5 * 2.0 + (distanceKm - 5) * 1.5)); // Arterial roads
  }
  // Regional state/national highways for distant kshetras (Nagalapuram, Penchalakona, Kanipakam)
  return Math.max(15, Math.round(5 * 2.0 + 15 * 1.5 + (distanceKm - 20) * 1.15));
}

/**
 * Formats minutes cleanly into hours and minutes (e.g. 1 hr 15 mins, 45 mins, 2 hrs)
 */
export function formatTravelTime(minutes: number, lang: string = 'en'): string {
  let mins = Math.max(1, Math.round(minutes));
  if (mins >= 30) {
    mins = Math.round(mins / 5) * 5;
  }
  if (mins < 60) {
    return lang === 'te' ? `${mins} ని.` : `${mins} mins`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) {
    if (lang === 'te') {
      return `${hours} గం.`;
    }
    return hours === 1 ? '1 hr' : `${hours} hrs`;
  }
  if (lang === 'te') {
    return `${hours} గం. ${remainingMins} ని.`;
  }
  return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMins} mins`;
}

