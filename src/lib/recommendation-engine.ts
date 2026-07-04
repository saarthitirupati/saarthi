import { PLACES, Place } from '@/data/places';
import { Plan, PlanStop } from '@/store/useTripStore';

export interface UserPreferences {
  timeMins: number;
  budgetTier: 'budget' | 'medium' | 'premium';
  interests: string[];
  groupType?: 'solo' | 'couple' | 'family' | 'elderly' | 'friends';
  travelMode?: 'walk' | 'bike' | 'car' | 'cab' | 'public';
}

export interface MLWeights {
  interests: Record<string, number>;
  budget: Record<string, number>;
  groupType: Record<string, number>;
  travelMode: Record<string, number>;
  rating: number;
  mustVisit: number;
  duration: number;
  trainingCount: number;
}

export const INTERESTS_KEYS = ['spiritual', 'nature', 'water', 'food', 'history', 'shopping', 'family', 'gems', 'adventure', 'photo', 'leisure', 'culture'];
export const BUDGET_KEYS = ['budget', 'medium', 'premium'];
export const GROUP_KEYS = ['solo', 'couple', 'family', 'elderly', 'friends'];
export const TRAVEL_KEYS = ['walk', 'bike', 'car', 'cab', 'public'];

export const DEFAULT_WEIGHTS: MLWeights = {
  interests: {
    spiritual: 1.5, nature: 1.5, water: 1.5, food: 1.5, history: 1.5,
    shopping: 1.5, family: 1.5, gems: 1.5, adventure: 1.5, photo: 1.5,
    leisure: 1.5, culture: 1.5
  },
  budget: { budget: 1.2, medium: 1.2, premium: 1.2 },
  groupType: { solo: 1.0, couple: 1.0, family: 1.0, elderly: 1.0, friends: 1.0 },
  travelMode: { walk: 0.8, bike: 0.8, car: 0.8, cab: 0.8, public: 0.8 },
  rating: 1.5,
  mustVisit: 1.0,
  duration: 0.5,
  trainingCount: 0
};

export function getMLWeights(): MLWeights {
  if (typeof window === 'undefined') return DEFAULT_WEIGHTS;
  try {
    const saved = localStorage.getItem('jeevapath_ml_weights');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_WEIGHTS,
        ...parsed,
        interests: { ...DEFAULT_WEIGHTS.interests, ...parsed.interests },
        budget: { ...DEFAULT_WEIGHTS.budget, ...parsed.budget },
        groupType: { ...DEFAULT_WEIGHTS.groupType, ...parsed.groupType },
        travelMode: { ...DEFAULT_WEIGHTS.travelMode, ...parsed.travelMode }
      };
    }
  } catch (e) {
    console.error('Failed to load ML weights', e);
  }
  return DEFAULT_WEIGHTS;
}

export function saveMLWeights(weights: MLWeights) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('jeevapath_ml_weights', JSON.stringify(weights));
  } catch (e) {
    console.error('Failed to save ML weights', e);
  }
}

export function resetMLWeights() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('jeevapath_ml_weights');
  } catch (e) {
    console.error('Failed to reset ML weights', e);
  }
}

export function getPreferencesVector(prefs: UserPreferences) {
  const v: Record<string, number> = {};
  
  // Interests (1.0 if matched, 0.0 otherwise)
  INTERESTS_KEYS.forEach(k => {
    v[`interest_${k}`] = prefs.interests.includes(k) ? 1.0 : 0.0;
  });
  
  // Budget
  BUDGET_KEYS.forEach(k => {
    v[`budget_${k}`] = prefs.budgetTier === k ? 1.0 : 0.0;
  });
  
  // Group type
  const group = prefs.groupType || 'family';
  GROUP_KEYS.forEach(k => {
    v[`group_${k}`] = group === k ? 1.0 : 0.0;
  });
  
  // Travel mode
  const mode = prefs.travelMode || 'car';
  TRAVEL_KEYS.forEach(k => {
    v[`travel_${k}`] = mode === k ? 1.0 : 0.0;
  });
  
  v.rating = 1.0; 
  v.mustVisit = 0.5; 
  v.duration = (prefs.timeMins || 180) / 480; 
  
  return v;
}

export function getPlaceVector(place: Place) {
  const v: Record<string, number> = {};
  
  // Interests
  INTERESTS_KEYS.forEach(k => {
    v[`interest_${k}`] = (place.interests?.includes(k) || place.placeType === k) ? 1.0 : 0.0;
  });
  
  // Budget
  BUDGET_KEYS.forEach(k => {
    v[`budget_${k}`] = place.budgetLevel === k ? 1.0 : 0.0;
  });
  
  // Group suitability (heuristics based on category/type)
  const groupSuitability: Record<string, Record<string, number>> = {
    spiritual: { family: 1.0, elderly: 1.0, solo: 0.5, couple: 0.5, friends: 0.6 },
    nature: { family: 0.8, elderly: 0.4, solo: 1.0, couple: 1.0, friends: 0.9 },
    water: { family: 0.9, elderly: 0.4, solo: 0.8, couple: 1.0, friends: 1.0 },
    food: { family: 1.0, elderly: 0.8, solo: 0.7, couple: 0.9, friends: 1.0 },
    historical: { family: 0.9, elderly: 0.6, solo: 1.0, couple: 0.7, friends: 0.8 },
    hidden: { family: 0.3, elderly: 0.1, solo: 1.0, couple: 0.9, friends: 0.9 },
    leisure: { family: 1.0, elderly: 0.7, solo: 0.6, couple: 0.9, friends: 0.9 },
    culture: { family: 1.0, elderly: 0.9, solo: 0.8, couple: 0.8, friends: 0.8 }
  };
  
  const suitability = groupSuitability[place.placeType] || { family: 0.7, elderly: 0.5, solo: 0.7, couple: 0.7, friends: 0.7 };
  GROUP_KEYS.forEach(k => {
    v[`group_${k}`] = suitability[k] || 0.5;
  });
  
  // Travel suitability
  TRAVEL_KEYS.forEach(k => {
    if (k === 'walk') v[`travel_${k}`] = place.distanceKms < 2.0 ? 1.0 : 0.2;
    else if (k === 'bike') v[`travel_${k}`] = place.distanceKms < 15 ? 1.0 : 0.4;
    else v[`travel_${k}`] = 0.8;
  });
  
  v.rating = (place.rating || 4.0) / 5.0;
  v.mustVisit = place.isMustVisit ? 1.0 : 0.0;
  v.duration = (place.durationMins || 60) / 480;
  
  return v;
}

export function scorePlace(place: Place, prefs: UserPreferences, type: 'best' | 'budget' | 'premium' = 'best'): number {
  // Hard intent filters
  const isSpiritualSelected = prefs.interests.includes('spiritual');
  if (place.placeType === 'spiritual' && !isSpiritualSelected) return 0;
  
  const interestMatch = place.interests?.some(interest => prefs.interests.includes(interest));
  if (!interestMatch && place.placeType !== 'spiritual') return 0;

  const weights = getMLWeights();
  const uVec = getPreferencesVector(prefs);
  const pVec = getPlaceVector(place);
  
  let dotProduct = 0;
  let uLengthSq = 0;
  let pLengthSq = 0;
  
  const addTerm = (key: string, w: number) => {
    const uVal = uVec[key] || 0;
    const pVal = pVec[key] || 0;
    dotProduct += w * uVal * pVal;
    uLengthSq += w * uVal * uVal;
    pLengthSq += w * pVal * pVal;
  };
  
  // 1. Interests
  INTERESTS_KEYS.forEach(k => {
    addTerm(`interest_${k}`, weights.interests[k]);
  });
  
  // 2. Budget
  BUDGET_KEYS.forEach(k => {
    let w = weights.budget[k];
    if (type === 'budget' && k === 'budget') w *= 2.5;
    if (type === 'premium' && k === 'premium') w *= 2.5;
    addTerm(`budget_${k}`, w);
  });
  
  // 3. Group type
  GROUP_KEYS.forEach(k => {
    addTerm(`group_${k}`, weights.groupType[k]);
  });
  
  // 4. Travel Mode
  TRAVEL_KEYS.forEach(k => {
    addTerm(`travel_${k}`, weights.travelMode[k]);
  });
  
  // 5. Numerical features
  let ratingWeight = weights.rating;
  if (type === 'premium') ratingWeight *= 2.5;
  
  let budgetStrategyPenalty = 0;
  if (type === 'budget') {
    if (place.entryFeeNum > 150) budgetStrategyPenalty = -40;
    else if (place.entryFeeNum === 0) dotProduct += 30; 
  }
  
  addTerm('rating', ratingWeight);
  addTerm('mustVisit', weights.mustVisit);
  addTerm('duration', weights.duration);
  
  const uLength = Math.sqrt(uLengthSq);
  const pLength = Math.sqrt(pLengthSq);
  
  if (uLength === 0 || pLength === 0) return 0;
  
  const cosineSim = dotProduct / (uLength * pLength);
  const finalScore = Math.max(0, cosineSim * 100) + budgetStrategyPenalty;
  
  return finalScore;
}

export function trainMLModel(savedPlaceIds: string[], allPlaces: Place[] = PLACES) {
  if (savedPlaceIds.length === 0) return;
  const weights = getMLWeights();
  const learningRate = 0.08;
  const epochs = 15;
  
  const positivePlaces = allPlaces.filter(p => savedPlaceIds.includes(p.id));
  const unsavedPlaces = allPlaces.filter(p => !savedPlaceIds.includes(p.id));
  const negativePlaces = [...unsavedPlaces]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.max(5, positivePlaces.length * 2));
  
  const trainingData: { place: Place; label: number }[] = [];
  positivePlaces.forEach(p => trainingData.push({ place: p, label: 1.0 }));
  negativePlaces.forEach(p => trainingData.push({ place: p, label: 0.0 }));
  
  const aggregatedInterests = new Set<string>();
  positivePlaces.forEach(p => p.interests?.forEach(i => aggregatedInterests.add(i)));
  
  const budgetCounts: Record<string, number> = { budget: 0, medium: 0, premium: 0 };
  positivePlaces.forEach(p => budgetCounts[p.budgetLevel] = (budgetCounts[p.budgetLevel] || 0) + 1);
  const bestBudgetTier = Object.keys(budgetCounts).reduce((a, b) => budgetCounts[a] > budgetCounts[b] ? a : b) as any;
  
  const dummyPrefs: UserPreferences = {
    interests: Array.from(aggregatedInterests).length ? Array.from(aggregatedInterests) : ['spiritual'],
    budgetTier: bestBudgetTier,
    timeMins: 360
  };
  
  const uVec = getPreferencesVector(dummyPrefs);
  
  for (let epoch = 0; epoch < epochs; epoch++) {
    const shuffled = [...trainingData].sort(() => 0.5 - Math.random());
    
    shuffled.forEach(({ place, label }) => {
      const pVec = getPlaceVector(place);
      
      let prediction = 0;
      const getWeight = (k: string) => {
        if (k.startsWith('interest_')) return weights.interests[k.replace('interest_', '')] || 1.0;
        if (k.startsWith('budget_')) return weights.budget[k.replace('budget_', '')] || 1.0;
        if (k.startsWith('group_')) return weights.groupType[k.replace('group_', '')] || 1.0;
        if (k.startsWith('travel_')) return weights.travelMode[k.replace('travel_', '')] || 1.0;
        if (k === 'rating') return weights.rating;
        if (k === 'mustVisit') return weights.mustVisit;
        if (k === 'duration') return weights.duration;
        return 1.0;
      };
      
      const updateWeight = (k: string, val: number) => {
        if (k.startsWith('interest_')) {
          const key = k.replace('interest_', '');
          weights.interests[key] = Math.max(0.1, Math.min(5.0, (weights.interests[key] || 1.0) + val));
        } else if (k.startsWith('budget_')) {
          const key = k.replace('budget_', '');
          weights.budget[key] = Math.max(0.1, Math.min(5.0, (weights.budget[key] || 1.0) + val));
        } else if (k.startsWith('group_')) {
          const key = k.replace('group_', '');
          weights.groupType[key] = Math.max(0.1, Math.min(5.0, (weights.groupType[key] || 1.0) + val));
        } else if (k.startsWith('travel_')) {
          const key = k.replace('travel_', '');
          weights.travelMode[key] = Math.max(0.1, Math.min(5.0, (weights.travelMode[key] || 1.0) + val));
        } else if (k === 'rating') {
          weights.rating = Math.max(0.1, Math.min(5.0, weights.rating + val));
        } else if (k === 'mustVisit') {
          weights.mustVisit = Math.max(0.1, Math.min(5.0, weights.mustVisit + val));
        } else if (k === 'duration') {
          weights.duration = Math.max(0.1, Math.min(5.0, weights.duration + val));
        }
      };
      
      const featureKeys = Object.keys(pVec);
      featureKeys.forEach(k => {
        const uVal = uVec[k] || 0;
        const pVal = pVec[k] || 0;
        const w = getWeight(k);
        prediction += w * uVal * pVal;
      });
      
      prediction = 1 / (1 + Math.exp(-prediction)); // Sigmoid activation
      const error = label - prediction;
      
      featureKeys.forEach(k => {
        const uVal = uVec[k] || 0;
        const pVal = pVec[k] || 0;
        const gradient = error * uVal * pVal * prediction * (1 - prediction); 
        updateWeight(k, learningRate * gradient);
      });
    });
  }
  
  weights.trainingCount = (weights.trainingCount || 0) + 1;
  saveMLWeights(weights);
}

function placesToPlan(places: Place[], type: 'best' | 'budget' | 'premium', startTime: number = 9): Plan {
  const stops: PlanStop[] = [];
  let totalMins = 0;
  let totalCost = 0;
  let currentTime = startTime * 60; 

  places.forEach((place, index) => {
    const travelTime = index === 0 ? 0 : 20; 
    const arrivalTimeMins = currentTime + travelTime;
    const departureTimeMins = arrivalTimeMins + place.durationMins;

    stops.push({
      placeId: place.id,
      arrivalTime: `${Math.floor(arrivalTimeMins / 60)}:${(arrivalTimeMins % 60).toString().padStart(2, '0')}`,
      departureTime: `${Math.floor(departureTimeMins / 60)}:${(departureTimeMins % 60).toString().padStart(2, '0')}`,
      travelToNext: 20,
      travelMode: 'car',
      estimatedCost: place.entryFeeNum
    });

    totalMins += travelTime + place.durationMins;
    totalCost += place.entryFeeNum;
    currentTime = departureTimeMins;
  });

  const meta = {
    best:    { title: 'Best Match',  emoji: '⭐', tagline: 'Balanced plan — highest value with smart routing.' },
    budget:  { title: 'Budget Pick', emoji: '💰', tagline: 'Spend smart — free & cheap spots, more stops.' },
    premium: { title: 'Premium Path', emoji: '✨', tagline: 'Exclusive picks — high-rated, unique, and rare.' },
  };

  return {
    type,
    ...meta[type],
    stops,
    totalMins,
    totalCost,
    highlights: places.slice(0, 3).map(p => p.name)
  };
}

export function generatePlans(
  prefs: UserPreferences,
  allPlaces: Place[] = PLACES
): { plans: Plan[]; recommendations: (Place & { score: number })[] } {
  
  const safePrefs: UserPreferences = {
    timeMins: prefs?.timeMins || 180,
    budgetTier: prefs?.budgetTier || 'medium',
    interests: prefs?.interests && prefs.interests.length > 0 ? prefs.interests : ['nature', 'spiritual'],
    groupType: prefs?.groupType || 'family',
    travelMode: prefs?.travelMode || 'car'
  };

  const getPlan = (type: 'best' | 'budget' | 'premium') => {
    const scored = allPlaces
      .map(p => ({ place: p, score: scorePlace(p, safePrefs, type) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const selected: Place[] = [];
    let totalTime = 0;
    for (const item of scored) {
      const travel = selected.length === 0 ? 0 : 20;
      if (totalTime + travel + item.place.durationMins <= safePrefs.timeMins) {
        selected.push(item.place);
        totalTime += travel + item.place.durationMins;
      }
      if (selected.length >= 5) break;
    }
    return placesToPlan(optimizeRoute(selected), type);
  };

  const plans = [
    getPlan('best'),
    getPlan('budget'),
    getPlan('premium')
  ];

  const recommendations = allPlaces
    .map(p => ({ ...p, score: scorePlace(p, safePrefs, 'best') }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return { plans, recommendations };
}

function optimizeRoute(places: Place[]): Place[] {
  if (places.length <= 1) return places;
  const optimized = [places[0]];
  let remaining = places.slice(1);
  while (remaining.length > 0) {
    const last = optimized[optimized.length - 1];
    let nearest = remaining[0];
    let minDist = distance(last, nearest);
    for (const place of remaining) {
      const dist = distance(last, place);
      if (dist < minDist) {
        nearest = place;
        minDist = dist;
      }
    }
    optimized.push(nearest);
    remaining = remaining.filter(p => p.id !== nearest.id);
  }
  return optimized;
}

function distance(p1: Place, p2: Place): number {
  if (!p1.coordinates || !p2.coordinates) return 999;
  const R = 6371;
  const dLat = (p2.coordinates.lat - p1.coordinates.lat) * Math.PI / 180;
  const dLon = (p2.coordinates.lng - p1.coordinates.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(p1.coordinates.lat * Math.PI / 180) * Math.cos(p2.coordinates.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getContextualRecommendations(
  allPlaces: Place[],
  userLocation: { lat: number; lng: number } | null,
  interests: string[] = ['spiritual', 'nature']
): (Place & { score: number; reason: string })[] {
  const currentHour = new Date().getHours();
  const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 16 ? 'afternoon' : currentHour < 20 ? 'evening' : 'night';

  const dummyPrefs: UserPreferences = {
    interests: interests.length > 0 ? interests : ['spiritual', 'nature'],
    budgetTier: 'medium',
    timeMins: 240
  };

  return allPlaces
    .map(place => {
      if (place.placeType === 'food' || place.category === 'Food' || (place.interests && place.interests.includes('food'))) {
        return null;
      }
      let score = scorePlace(place, dummyPrefs, 'best');
      if (score === 0) return null;

      let reason = 'Recommended for you';

      if (timeOfDay === 'morning') {
        if (place.placeType === 'spiritual') {
          score += 25;
          reason = '🌅 Ideal for morning darshan';
        } else if (place.placeType === 'nature') {
          score += 15;
          reason = '🍃 Fresh morning nature walk';
        }
      } else if (timeOfDay === 'afternoon') {
        if (place.placeType === 'historical' || place.category?.toLowerCase().includes('museum')) {
          score += 20;
          reason = '🏛️ Perfect indoor afternoon visit';
        }
      } else if (timeOfDay === 'evening') {
        if (place.placeType === 'hidden' || place.placeType === 'nature' || place.placeType === 'leisure') {
          score += 25;
          reason = '🌇 Perfect evening view';
        }
      } else {
        if (place.placeType === 'leisure') {
          score += 20;
          reason = '🌙 Great evening activities';
        }
      }

      if (userLocation && place.coordinates) {
        const dist = distance({ coordinates: userLocation } as any, place);
        if (dist < 5) {
          score += 30;
          reason = `📍 Very close to you (${dist.toFixed(1)} km)`;
        } else if (dist < 15) {
          score += 15;
        }
      }

      return { ...place, score, reason };
    })
    .filter((p): p is (Place & { score: number; reason: string }) => p !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
