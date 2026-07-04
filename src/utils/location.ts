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
 * Calculates a realistic driving distance by applying road routing factors
 */
export function calculateDrivingDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  isTirumalaSpot: boolean = false
): number {
  const dist = calculateDistance(lat1, lon1, lat2, lon2);
  if (isTirumalaSpot && dist < 24) {
    return Number(Math.max(25, dist * 1.6).toFixed(1));
  }
  
  let factor = 1.15;
  if (dist < 15) {
    factor = 1.35;
  } else if (dist < 40) {
    factor = 1.25;
  }
  
  return Number((dist * factor).toFixed(1));
}

/**
 * Fallback Tirupati center coordinates
 */
export const TIRUPATI_CENTER = {
  lat: 13.6288,
  lng: 79.4192,
};
