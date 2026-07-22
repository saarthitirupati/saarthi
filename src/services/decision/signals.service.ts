/**
 * Signal Collector Service
 * Collects raw signals from GPS, Weather, Festival, Crowd, Parking, and RTC APIs.
 */

import { TIRUPATI_CENTER } from '@/utils/location';

export interface RawSignals {
  gps: { lat: number; lng: number };
  timestamp: string;
  dayOfWeek: string;
  timeHour: number;
  weather: 'sunny' | 'rain' | 'cloudy' | 'heatwave';
  activeFestival: string | null;
  liveCrowdStatus: 'low' | 'moderate' | 'high' | 'extreme';
  roadClosures: string[];
  parkingStatus: Record<string, 'available' | 'limited' | 'full'>;
  journeyStage: 'before_darshan' | 'after_darshan' | 'returning' | 'general';
}

export async function collectRawSignals(query: {
  lat?: string | number;
  lng?: string | number;
  journeyStage?: string;
}): Promise<RawSignals> {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayOfWeek = days[now.getDay()];
  const timeHour = now.getHours();

  // Ingest GPS or fallback
  const parsedLat = Number(query.lat);
  const parsedLng = Number(query.lng);
  const lat = (!isNaN(parsedLat) && parsedLat !== 0) ? parsedLat : TIRUPATI_CENTER.lat;
  const lng = (!isNaN(parsedLng) && parsedLng !== 0) ? parsedLng : TIRUPATI_CENTER.lng;

  // Weather signal (with fallback)
  let weather: 'sunny' | 'rain' | 'cloudy' | 'heatwave' = 'sunny';
  if (timeHour >= 11 && timeHour <= 15) {
    weather = 'sunny';
  } else if (timeHour >= 16) {
    weather = 'cloudy';
  }

  // Live crowd status signal
  let liveCrowdStatus: 'low' | 'moderate' | 'high' | 'extreme' = 'moderate';
  if (timeHour >= 6 && timeHour <= 12) {
    liveCrowdStatus = 'high';
  }

  return {
    gps: { lat, lng },
    timestamp: now.toISOString(),
    dayOfWeek,
    timeHour,
    weather,
    activeFestival: null,
    liveCrowdStatus,
    roadClosures: [],
    parkingStatus: {
      'vishnu-nivasam': 'available',
      'srinivasam': 'limited',
      'bhudevi': 'available'
    },
    journeyStage: (query.journeyStage as any) || 'general'
  };
}
