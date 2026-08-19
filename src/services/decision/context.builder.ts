/**
 * Context Builder
 * Transforms raw signals into a clean, structured Context object.
 */

import { RawSignals } from './signals.service';

export interface DerivedContext {
  userLocation: { lat: number; lng: number };
  locationLabel: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  weather: 'sunny' | 'rain' | 'cloudy' | 'heatwave';
  crowdLevel: 'low' | 'moderate' | 'high' | 'extreme';
  journeyStage: 'before_darshan' | 'after_darshan' | 'returning' | 'general';
  activeFestival: string | null;
  roadClosures: string[];
  parkingStatus: Record<string, 'available' | 'limited' | 'full'>;
  featureFlags: {
    weatherActive: boolean;
    crowdActive: boolean;
    festivalActive: boolean;
    parkingActive: boolean;
  };
}

import { isCoordinateOnTirumalaHill } from '@/utils/location';

export function buildDerivedContext(signals: RawSignals): DerivedContext {
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
  if (signals.timeHour >= 12 && signals.timeHour < 16) {
    timeOfDay = 'afternoon';
  } else if (signals.timeHour >= 16 && signals.timeHour < 20) {
    timeOfDay = 'evening';
  } else if (signals.timeHour >= 20 || signals.timeHour < 5) {
    timeOfDay = 'night';
  }

  // Determine location label
  let locationLabel = 'Tirupati Region';
  if (isCoordinateOnTirumalaHill(signals.gps.lat, signals.gps.lng)) {
    locationLabel = 'Tirumala Hilltop';
  } else if (signals.gps.lat >= 13.62 && signals.gps.lat <= 13.64) {
    locationLabel = 'Tirupati Central';
  }

  return {
    userLocation: signals.gps,
    locationLabel,
    timeOfDay,
    dayOfWeek: signals.dayOfWeek,
    weather: signals.weather,
    crowdLevel: signals.liveCrowdStatus,
    journeyStage: signals.journeyStage,
    activeFestival: signals.activeFestival,
    roadClosures: signals.roadClosures,
    parkingStatus: signals.parkingStatus,
    featureFlags: {
      weatherActive: true,
      crowdActive: true,
      festivalActive: true,
      parkingActive: true
    }
  };
}
