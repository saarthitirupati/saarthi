import { Place } from '@/data/places';
import { DerivedContext } from '../context.builder';

export function calculateParkingScore(place: Place, context: DerivedContext): { score: number; reason?: string; source?: string } {
  if (!context.featureFlags.parkingActive) return { score: 0 };

  const pStatus = context.parkingStatus[place.id] || 'available';
  if (pStatus === 'full') {
    return { score: -20, reason: 'Parking currently full', source: 'Traffic Alert' };
  } else if (pStatus === 'available') {
    return { score: 15, reason: 'Ample parking available', source: 'Saarthi' };
  }

  return { score: 5 };
}

export function calculateAccessibilityScore(place: Place, context: DerivedContext): { score: number; reason?: string; source?: string } {
  if (context.journeyStage === 'before_darshan' && place.tags?.includes('Lockers')) {
    return { score: 35, reason: 'Essential locker deposit before darshan', source: 'Saarthi' };
  }
  return { score: 0 };
}

export function calculateRTCScore(place: Place, context: DerivedContext): { score: number; reason?: string; source?: string } {
  if (place.travelByRTC) {
    return { score: 10, reason: 'Frequent RTC bus connections', source: 'APS RTC' };
  }
  return { score: 0 };
}
