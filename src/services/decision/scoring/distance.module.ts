import { Place } from '@/data/places';
import { DerivedContext } from '../context.builder';
import { calculateDrivingDistance, TIRUPATI_CENTER } from '@/utils/location';

export function calculateDistanceScore(place: Place, context: DerivedContext): { score: number; distanceKm: number; reason?: string } {
  const userLoc = context.userLocation || TIRUPATI_CENTER;
  const targetLat = place.coordinates?.lat || TIRUPATI_CENTER.lat;
  const targetLng = place.coordinates?.lng || TIRUPATI_CENTER.lng;

  const locLower = (place.location || '').toLowerCase();
  const isTirumala = locLower.includes('tirumala') || locLower.includes('narayanagiri') || place.id === 'venkateswara';

  const distanceKm = calculateDrivingDistance(userLoc.lat, userLoc.lng, targetLat, targetLng, isTirumala);

  let score = 5;
  if (distanceKm < 2) {
    score = 35;
  } else if (distanceKm < 5) {
    score = 25;
  } else if (distanceKm < 10) {
    score = 15;
  }

  const travelMins = Math.max(2, Math.round(distanceKm * 2.2));

  return {
    score,
    distanceKm,
    reason: `${travelMins} mins away (${distanceKm.toFixed(1)} km)`
  };
}
