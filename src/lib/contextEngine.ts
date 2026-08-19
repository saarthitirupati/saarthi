import type { Place } from '@/types/place';
import type { PlannerInput } from '@/types/journey';

const INTEREST_MAP: Record<string, string[]> = {
  spiritual: ['spiritual', 'dosha-nivarana', 'marriage'],
  nature:    ['nature', 'geology', 'viewpoint'],
  water:     ['nature', 'water'],
  food:      ['food'],
  history:   ['history', 'architecture', 'culture', 'historical'],
  shopping:  ['shopping', 'arts', 'culture'],
  family:    ['family', 'leisure'],
  gems:      ['hidden', 'trekking'],
  adventure: ['trekking', 'nature'],
  photo:     ['viewpoint', 'nature', 'architecture'],
};

function expandInterests(interests: string[]): string[] {
  const out = new Set<string>(interests);
  for (const i of interests) {
    (INTEREST_MAP[i] ?? []).forEach(k => out.add(k));
  }
  return Array.from(out);
}

export function getBestForToday(
  allPlaces: Place[],
  crowdLevel: 'low' | 'moderate' | 'high' | 'very-high',
  weather: string,
  plannerInput?: PlannerInput | null
): { place: Place; reasons: string[]; score: number; shouldVisitNow: boolean; shouldVisitVerdict: string } {
  const hour = new Date().getHours();
  const isRain = /rain/i.test(weather);
  const tempMatch = weather.match(/(\d+)/);
  const temp = tempMatch ? parseInt(tempMatch[1]) : 25;
  const isHot = temp >= 35;

  let places = allPlaces;

  // --- 1. Zero Irrelevance Guarantee (Subtractive Filter) ---
  if (plannerInput?.interests && plannerInput.interests.length > 0) {
    const selectedInterests = plannerInput.interests;
    const isSpiritualSelected = selectedInterests.includes('spiritual');
    const expanded = expandInterests(selectedInterests);

    const filtered = allPlaces.filter(place => {
      // Strict Temple Rule: No spiritual place unless spiritual interest is selected
      if (place.placeType === 'spiritual' && !isSpiritualSelected) return false;
      
      // Interest Match: Place must have at least one interest matching our expanded set
      const hasMatch = place.interests.some(i => expanded.includes(i)) || expanded.includes(place.placeType);
      return hasMatch;
    });

    // Only apply if we have matches, otherwise fall back to all places to prevent empty screens
    if (filtered.length > 0) {
      places = filtered;
    }
  }

  const scored = places.map((place) => {
    const reasons: string[] = [];
    let score = 0;

    // --- A. Weather Suitability (30 points) ---
    if (isRain) {
      if (place.placeType === 'spiritual' || place.tags.includes('Indoor')) {
        score += 30;
        reasons.push('🌧 Indoor venue — ideal during rain');
      }
    } else if (isHot) {
      if (place.tags.includes('Forest') || place.tags.includes('Shade') || place.placeType === 'nature') {
        score += 30;
        reasons.push('🌳 Forest shade — cooler during summer heat');
      } else {
        score += 10;
      }
    } else {
      score += 25;
      if (place.placeType === 'nature' || place.placeType === 'water') {
        score += 5;
        reasons.push('☀ Pleasant weather — perfect for outdoors');
      } else {
        reasons.push('☀ Pleasant weather — great for visiting');
      }
    }

    // --- B. Crowd Avoidance (25 points) ---
    if (crowdLevel === 'high' || crowdLevel === 'very-high') {
      if (place.id !== 'srivari-swamy-temple') {
        score += 15;
      }
      if (place.isHiddenGem || place.placeType === 'nature' || place.placeType === 'water' || place.placeType === 'hidden') {
        score += 10;
        reasons.push('🏞 Less crowded alternative');
      }
    } else if (crowdLevel === 'low') {
      if (place.isMustVisit) {
        score += 25;
        reasons.push('🟢 Low crowd right now');
      } else {
        score += 15;
      }
    } else {
      score += 18;
    }

    // --- C. Open Now (20 points) ---
    const isOpen = hour >= place.openFrom && hour < place.openTo;
    if (isOpen) {
      score += 20;
      reasons.push('🕒 Open now');
    }

    // --- D. Distance (15 points) ---
    const distScore = 15 * Math.max(0, 1 - place.distanceKms / 50);
    score += distScore;
    if (place.distanceKms <= 5) {
      reasons.push(`🚗 Only ${place.distanceKms} km away`);
    } else if (place.distanceKms <= 15) {
      reasons.push(`🚗 ${place.distanceKms} km away`);
    }

    // --- E. User Profile / Accessibility Scoring (SOP Principles) ---
    if (plannerInput) {
      const { groupType, budgetTier } = plannerInput;

      // 1. Elderly Accessibility (AAA standard)
      if (groupType === 'elderly') {
        if (place.difficulty === 'hard') {
          score -= 50; // Heavily penalize high-strain places (steps, steep climbs)
        } else if (place.difficulty === 'easy') {
          score += 20;
          reasons.push('👴 Easy, low-strain access');
        }
        if (place.distanceKms < 10 && place.durationMins <= 120) {
          score += 10;
        }
      }

      // 2. Student Adventure & Budget
      if (groupType === 'solo' && budgetTier === 'budget') {
        if (place.budgetLevel === 'budget' || place.entryFeeNum === 0) {
          score += 25;
          reasons.push('💰 Free / Budget-friendly');
        }
        if (place.placeType === 'nature' || place.placeType === 'hidden') {
          score += 15;
          reasons.push('🥾 Great for adventure');
        }
      }

      // 3. Premium Convenience
      if (budgetTier === 'premium') {
        if (place.budgetLevel === 'premium' || place.rating >= 4.8) {
          score += 20;
          reasons.push('⭐ Top-rated premium experience');
        }
      }
    }

    return { place, reasons, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0] || { place: allPlaces[0], reasons: ['Default recommendation'], score: 0 };

  const isOpen = hour >= best.place.openFrom && hour < best.place.openTo;
  const shouldVisitNow = (crowdLevel === 'low' || crowdLevel === 'moderate') && isOpen;

  let shouldVisitVerdict: string;
  if (crowdLevel === 'very-high') {
    shouldVisitVerdict = 'Wait — heavy crowd, try after 5 PM';
  } else if (crowdLevel === 'high') {
    shouldVisitVerdict = 'Wait — crowd is high, consider off-peak hours';
  } else if (isRain) {
    shouldVisitVerdict = shouldVisitNow ? 'Yes — but carry an umbrella' : 'Wait — currently closed';
  } else if (shouldVisitNow) {
    shouldVisitVerdict = 'Yes — conditions are great right now';
  } else {
    shouldVisitVerdict = 'Wait — currently closed';
  }

  return {
    place: best.place,
    reasons: best.reasons,
    score: Math.round(best.score),
    shouldVisitNow,
    shouldVisitVerdict,
  };
}

import { calculateDrivingDistance, TIRUPATI_CENTER, isCoordinateOnTirumalaHill } from '@/utils/location';
import { isValidCoordinates } from '@/lib/location';

export type ContextInput = {
  lat?: number;
  lng?: number;
  time?: string;
  weather?: string;
  temp?: number;
  crowdLevel?: string;
  dayOfWeek?: string;
};

export interface ScoredPlaceResult {
  score: number;
  reasons: string[];
  distanceKm: number;
  travelTimeMins: number;
  rank_tier: 'BEST_RIGHT_NOW' | 'ALTERNATIVE' | 'HIDDEN_GEM' | 'TOP' | 'RECOMMENDED' | 'FEASIBLE' | 'UNAVAILABLE' | string;
}

export function scorePlace(place: any, liveStatus: any, alerts: any[], context: ContextInput): ScoredPlaceResult {
  const userLat = (context?.lat && isValidCoordinates(context.lat, context.lng || 0)) ? context.lat : TIRUPATI_CENTER.lat;
  const userLng = (context?.lng && isValidCoordinates(context.lat || 0, context.lng)) ? context.lng : TIRUPATI_CENTER.lng;

  const targetLat = place?.coordinates?.lat ?? place?.lat ?? TIRUPATI_CENTER.lat;
  const targetLng = place?.coordinates?.lng ?? place?.lng ?? TIRUPATI_CENTER.lng;

  const isTirumalaSpot = Boolean(
    place?.category === 'Tirumala Spot' ||
    place?.location?.toLowerCase().includes('tirumala') ||
    isCoordinateOnTirumalaHill(targetLat, targetLng)
  );

  // 1. Dynamic driving distance calculation
  const distanceKm = calculateDrivingDistance(userLat, userLng, targetLat, targetLng, isTirumalaSpot);

  // 2. Realistic travel time estimate
  const travelTimeMins = Math.max(5, Math.round(isTirumalaSpot ? distanceKm * 3.0 : distanceKm * 2.2));

  const reasons: string[] = [];
  let score = 50; // baseline

  // --- A. Distance Reason ---
  if (distanceKm <= 3) {
    score += 35;
    reasons.push(`🚗 Only ${distanceKm.toFixed(1)} km away (${travelTimeMins} mins)`);
  } else if (distanceKm <= 10) {
    score += 25;
    reasons.push(`🚗 Nearby — ${distanceKm.toFixed(1)} km away (${travelTimeMins} mins)`);
  } else if (distanceKm <= 25) {
    score += 15;
    reasons.push(`🚗 ${distanceKm.toFixed(1)} km transit (${travelTimeMins} mins)`);
  } else {
    score += 5;
    reasons.push(`📍 Day trip destination (${distanceKm.toFixed(1)} km)`);
  }

  // --- B. Open Hours & Status ---
  const hour = new Date().getHours();
  const openFrom = place?.openFrom ?? 6;
  const openTo = place?.openTo ?? 21;
  const isOpen = hour >= openFrom && hour < openTo;

  if (isOpen) {
    score += 20;
    reasons.push('🕒 Currently Open');
  } else {
    score -= 30; // Closed places heavily penalized
  }

  // --- C. Live Crowd Status ---
  const crowd = liveStatus?.crowd_level || context?.crowdLevel || 'LOW';
  if (crowd === 'LOW') {
    score += 20;
    reasons.push('🟢 Low crowd level right now');
  } else if (crowd === 'MEDIUM' || crowd === 'MODERATE') {
    score += 10;
    reasons.push('🟡 Moderate crowd flow');
  } else if (crowd === 'EXTREME' || crowd === 'VERY_HIGH') {
    score -= 20;
    reasons.push('🔴 Heavy crowd reported');
  }

  // --- D. Weather Suitability ---
  const weather = (context?.weather || '').toLowerCase();
  const isRain = weather.includes('rain');
  const isIndoor = place?.context?.indoor || place?.tags?.includes('Indoor');

  if (isRain) {
    if (isIndoor) {
      score += 20;
      reasons.push('🌧 Indoor facility — protected from rain');
    } else {
      score -= 10;
    }
  } else {
    if (!isIndoor) {
      score += 10;
      reasons.push('☀ Great outdoor weather today');
    }
  }

  // Mandatory AGENTS.md rule: Recommendation must have clear, explainable reasons
  if (reasons.length === 0) {
    return {
      score: -100,
      reasons: [],
      distanceKm,
      travelTimeMins,
      rank_tier: 'UNAVAILABLE'
    };
  }

  let rank_tier: 'TOP' | 'RECOMMENDED' | 'FEASIBLE' | 'UNAVAILABLE' = 'FEASIBLE';
  if (score >= 80) rank_tier = 'TOP';
  else if (score >= 50) rank_tier = 'RECOMMENDED';
  else if (score < 0) rank_tier = 'UNAVAILABLE';

  return {
    score: Math.round(score),
    reasons,
    distanceKm: Number(distanceKm.toFixed(1)),
    travelTimeMins,
    rank_tier
  };
}


