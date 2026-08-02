/**
 * Core Decision Engine Orchestrator
 * Executes availability check, calls scoring modules, and ranks items.
 */

import { Place } from '@/data/places';
import { DerivedContext } from './context.builder';
import { checkPlaceAvailability } from './availability.engine';
import { calculateDistanceScore } from './scoring/distance.module';
import { calculateWeatherScore } from './scoring/weather.module';
import { calculateCrowdScore } from './scoring/crowd.module';
import { calculateFestivalScore } from './scoring/festival.module';
import { calculateParkingScore, calculateAccessibilityScore, calculateRTCScore } from './scoring/parking.module';

export interface ScoredPlace {
  place: Place;
  totalScore: number;
  distanceKm: number;
  isAvailable: boolean;
  reasons: { label: string; source: string; confidence: number }[];
  negativeReasons: { label: string; source: string }[];
}

export function evaluatePlace(place: Place, context: DerivedContext): ScoredPlace {
  // 1. Availability Layer Check
  const avail = checkPlaceAvailability(place, context);
  if (!avail.isAvailable) {
    return {
      place,
      totalScore: -1000,
      distanceKm: 0,
      isAvailable: false,
      reasons: [],
      negativeReasons: [{ label: avail.reason || 'Closed', source: avail.source || 'TTD' }]
    };
  }

  // 2. Execute Plugin Scoring Modules
  const distRes = calculateDistanceScore(place, context);
  const weatherRes = calculateWeatherScore(place, context);
  const crowdRes = calculateCrowdScore(place, context);
  const festRes = calculateFestivalScore(place, context);
  const parkRes = calculateParkingScore(place, context);
  const accRes = calculateAccessibilityScore(place, context);
  const rtcRes = calculateRTCScore(place, context);

  // Base priority score
  const basePriority = place.isMustVisit ? 30 : 15;

  // Time-of-day & Open Hours heuristic utility calculation
  let timeScore = 15;
  let timeReason: string | undefined = undefined;
  const currentHour = new Date().getHours();

  if (place.openFrom !== undefined && place.openTo !== undefined) {
    if (currentHour < place.openFrom || currentHour >= place.openTo) {
      timeScore = -150;
    }
  }

  if (timeScore >= 0) {
    const pType = (place.placeType || '').toLowerCase();
    const cat = (place.category || '').toLowerCase();
    const nameLower = place.name.toLowerCase();

    if (context.timeOfDay === 'morning') {
      if (pType === 'nature' || pType === 'water' || pType === 'viewpoint' || nameLower.includes('footpath')) {
        timeScore = 30;
        timeReason = 'Ideal Morning Visit';
      }
    } else if (context.timeOfDay === 'afternoon') {
      if (pType === 'indoor' || nameLower.includes('museum') || nameLower.includes('science') || nameLower.includes('planetarium')) {
        timeScore = 30;
        timeReason = 'Cool Indoor Escape';
      }
    } else if (context.timeOfDay === 'evening') {
      if (cat.includes('culture') || nameLower.includes('shopping') || nameLower.includes('gandhi') || nameLower.includes('park') || cat.includes('temple')) {
        timeScore = 30;
        timeReason = 'Evening Recommended';
      }
    }
  }

  const totalScore = basePriority +
    distRes.score +
    weatherRes.score +
    crowdRes.score +
    festRes.score +
    parkRes.score +
    accRes.score +
    rtcRes.score +
    timeScore;

  // 3. Assemble Attributed Reasons
  const reasons: { label: string; source: string; confidence: number }[] = [];
  const negativeReasons: { label: string; source: string }[] = [];

  // Opening status reason
  reasons.push({ label: 'Open Now', source: 'TTD', confidence: 99 });

  if (distRes.reason) {
    reasons.push({ label: distRes.reason, source: 'Saarthi', confidence: 98 });
  }
  if (timeReason) {
    reasons.push({ label: timeReason, source: 'Schedule', confidence: 96 });
  }
  if (weatherRes.reason) {
    if (weatherRes.score >= 0) {
      reasons.push({ label: weatherRes.reason, source: weatherRes.source || 'IMD', confidence: 95 });
    } else {
      negativeReasons.push({ label: weatherRes.reason, source: weatherRes.source || 'IMD' });
    }
  }
  if (crowdRes.reason) {
    if (crowdRes.score >= 0) {
      reasons.push({ label: crowdRes.reason, source: crowdRes.source || 'Live Update', confidence: 94 });
    } else {
      negativeReasons.push({ label: crowdRes.reason, source: crowdRes.source || 'Live Update' });
    }
  }
  if (festRes.reason && festRes.score > 0) {
    reasons.push({ label: festRes.reason, source: festRes.source || 'TTD Calendar', confidence: 97 });
  }

  return {
    place,
    totalScore,
    distanceKm: distRes.distanceKm,
    isAvailable: true,
    reasons,
    negativeReasons
  };
}

export function processDecisionEngine(allPlaces: Place[], context: DerivedContext): ScoredPlace[] {
  return allPlaces
    .map(p => evaluatePlace(p, context))
    .filter(sp => sp.isAvailable)
    .sort((a, b) => b.totalScore - a.totalScore);
}
