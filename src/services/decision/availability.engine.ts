/**
 * Availability & Safety Engine
 * Filters out unsafe or unavailable places BEFORE scoring to save CPU and enforce pilgrim safety.
 */

import { Place } from '@/data/places';
import { DerivedContext } from './context.builder';

export interface AvailabilityResult {
  isAvailable: boolean;
  reason?: string;
  source?: string;
}

export function checkPlaceAvailability(place: Place, context: DerivedContext): AvailabilityResult {
  // 1. Emergency Road Closure Check
  if (context.roadClosures.some(road => (place.address || '').toLowerCase().includes(road.toLowerCase()))) {
    return {
      isAvailable: false,
      reason: 'Access road temporarily closed',
      source: 'Police / Traffic Update'
    };
  }

  // 2. Opening Hours Check
  const currentHour = new Date().getHours() + (new Date().getMinutes() / 60);
  if (place.openFrom !== undefined && place.openTo !== undefined) {
    if (place.openFrom < place.openTo) {
      if (currentHour < place.openFrom || currentHour >= place.openTo) {
        return {
          isAvailable: false,
          reason: `Closed for day (Opens at ${place.openingTime || '5:00 AM'})`,
          source: 'TTD Schedule'
        };
      }
    } else {
      // Overnight hours (e.g. 20 to 5)
      if (currentHour < place.openFrom && currentHour >= place.openTo) {
        return {
          isAvailable: false,
          reason: 'Closed at this hour',
          source: 'TTD Schedule'
        };
      }
    }
  }

  // 3. Tuesday Maintenance Check for Zoo
  if (place.id === 'sv-zoo-park' && context.dayOfWeek === 'tuesday') {
    return {
      isAvailable: false,
      reason: 'Weekly Tuesday Maintenance Closure',
      source: 'Forest Department'
    };
  }

  return { isAvailable: true };
}
