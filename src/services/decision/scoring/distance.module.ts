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

  let score = Math.max(5, Math.round(55 - (distanceKm * 3.5)));

  let reason: string | undefined = undefined;
  if (distanceKm < 1.5) {
    reason = 'Nearest to You';
  } else if (distanceKm < 4.0) {
    reason = 'Short Travel';
  } else if (distanceKm < 8.0) {
    reason = 'Easy Access';
  }

  return {
    score,
    distanceKm,
    reason
  };
}
