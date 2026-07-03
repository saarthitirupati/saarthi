import { PLACES, Place } from '@/data/places';
import { PlannerInput, Plan, PlanStop } from '@/store/useTripStore';

function isDuringBreak(breaks: { from: string; to: string }[] | undefined, time: Date): boolean {
  if (!breaks || breaks.length === 0) return false;

  const parseTime = (str: string): number => {
    // Handles '1:00 PM', '13:00', etc.
    const match12 = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match12) {
      let hr = parseInt(match12[1], 10);
      const min = parseInt(match12[2], 10);
      if (match12[3].toUpperCase() === 'PM' && hr < 12) hr += 12;
      if (match12[3].toUpperCase() === 'AM' && hr === 12) hr = 0;
      return hr * 60 + min;
    }
    // 24h format fallback
    const parts = str.split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  };

  const checkMinutes = time.getHours() * 60 + time.getMinutes();

  return breaks.some(b => {
    const start = parseTime(b.from);
    const end = parseTime(b.to);
    if (start <= end) {
      return checkMinutes >= start && checkMinutes <= end;
    }
    return checkMinutes >= start || checkMinutes <= end;
  });
}

// ── Interest synonym expansion ────────────────────────────────────────────────
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

// ── Strict Filter Rule (PRD Category Isolation) ────────────────────────────────
function filterByIntent(all: Place[], selectedInterests: string[], expanded: string[]): Place[] {
  const isSpiritualSelected = selectedInterests.includes('spiritual');
  
  return all.filter(place => {
    // 1. Strict Temple Rule: No spiritual place unless spiritual interest is selected
    if (place.placeType === 'spiritual' && !isSpiritualSelected) return false;
    
    // 2. Interest Match: Place must have at least one interest matching our expanded set
    const hasMatch = place.interests.some(i => expanded.includes(i)) || expanded.includes(place.placeType);
    return hasMatch;
  });
}

// ── Safe defaults ─────────────────────────────────────────────────────────────
function safeInput(raw: PlannerInput | null | undefined): PlannerInput {
  return {
    timeMins:   raw?.timeMins   ?? 180,
    budget:     raw?.budget     ?? 1000,
    budgetTier: raw?.budgetTier ?? 'medium',
    interests:  raw?.interests?.length ? raw.interests : ['nature'],
    groupType:  raw?.groupType  ?? 'family',
    travelMode: raw?.travelMode ?? 'car',
  };
}

// ── Base scorer: shared by all plans ─────────────────────────────────────────
function baseScore(place: Place, input: PlannerInput, expanded: string[]): number {
  let s = 0;

  // Interest match (40 pts)
  const matchCount = place.interests.filter(i => expanded.includes(i)).length;
  s += (matchCount / Math.max(place.interests.length, 1)) * 40;
  if (expanded.includes(place.placeType)) s += 15;

  // Rating (20 pts)
  s += (Math.min(place.rating, 5) / 5) * 20;

  // Must-visit bonus (5 pts)
  if (place.isMustVisit) s += 5;

  // Group fit (12 pts)
  const { groupType } = input;
  if (groupType === 'family'  && ['nature', 'leisure', 'culture'].includes(place.placeType)) s += 12;
  if (groupType === 'couple'  && ['water', 'nature', 'hidden'].includes(place.placeType))    s += 12;
  if (groupType === 'solo'    && ['hidden', 'nature', 'historical'].includes(place.placeType)) s += 12;
  if (groupType === 'elderly' && place.distanceKms < 10 && place.durationMins <= 120)        s += 12;

  return s;
}

// ── Per-plan re-scorers — give each plan a genuinely different ranking ────────

function scoreBest(place: Place, base: number): number {
  let s = base;
  // Balanced: reward variety, moderate distance, not the most crowded
  if (place.distanceKms < 15) s += 8;
  if (place.reviewCount > 40000) s -= 5; // slight crowd penalty
  return s;
}

function scoreBudget(place: Place, base: number): number {
  let s = base;
  // Heavily reward free/cheap
  if (place.entryFeeNum === 0)        s += 35;
  else if (place.entryFeeNum <= 50)   s += 18;
  else if (place.entryFeeNum <= 150)  s += 5;
  else                                s -= 30; // penalise expensive places strongly

  // Reward proximity (saves transport cost)
  if (place.distanceKms < 5)          s += 20;
  else if (place.distanceKms < 15)    s += 8;
  else if (place.distanceKms > 40)    s -= 20;

  // Prefer budget-labelled places
  if (place.budgetLevel === 'budget')  s += 10;
  return s;
}

function scorePremium(place: Place, base: number): number {
  let s = base;
  // Reward quality + rarity
  if (place.rating >= 4.8)            s += 30;
  else if (place.rating >= 4.6)       s += 15;

  // Unique / off-the-beaten-path
  if (place.placeType === 'hidden')   s += 25;
  if (place.reviewCount < 5000)       s += 15; // less-visited = exclusive

  // Penalise ultra-cheap (not premium feel)
  if (place.entryFeeNum === 0 && place.budgetLevel === 'budget') s -= 10;

  // Reward premium label
  if (place.budgetLevel === 'premium') s += 15;
  return s;
}

// ── Candidate pools: each plan uses a DIFFERENT restricted pool ───────────────

function poolBudget(all: Place[]): Place[] {
  const pool = all.filter(p => p.budgetLevel === 'budget' || p.entryFeeNum < 100);
  return pool.length >= 4 ? pool : all.filter(p => p.entryFeeNum < 200);
}

function poolPremium(all: Place[]): Place[] {
  const pool = all.filter(p => p.rating >= 4.5 || p.isMustVisit || p.placeType === 'hidden');
  return pool.length >= 4 ? pool : all.filter(p => p.rating >= 4.2);
}

// ── Greedy route builder ──────────────────────────────────────────────────────

function buildRoute(
  type: 'best' | 'budget' | 'premium',
  scoredPool: (Place & { score: number })[],
  input: PlannerInput,
  allPlaces: Place[],
  excludeIds: Set<string> = new Set(),
): Plan {
  const { timeMins, travelMode } = input;
  let remainingTime = timeMins;
  let totalCost = 0;
  const stops: PlanStop[] = [];
  const highlights: string[] = [];

  let currentDist = 0;
  let currentTime = new Date();
  currentTime.setHours(9, 0, 0, 0);

  // Premium gets more stops; budget prioritises quantity; best is balanced
  const maxStops = type === 'premium' ? 5 : type === 'budget' ? 5 : 4;
  const minRemaining = 20;

  while (remainingTime > minRemaining && stops.length < maxStops) {
    let bestNext: (Place & { score: number }) | null = null;
    let bestEfficiency = -Infinity;
    let bestTravelTime = 0;
    let bestTotalNeeded = 0;

    for (const place of scoredPool) {
      if (stops.some(s => s.placeId === place.id)) continue;
      if (excludeIds.has(place.id)) continue; // forced differentiation

      const distKm = Math.abs(place.distanceKms - currentDist);
      const travelTime = Math.max(10, Math.round(distKm * 3));
      const totalNeeded = place.durationMins + travelTime;

      if (totalNeeded > remainingTime) continue;

      // 1. Temple Break Timings Constraint
      const potentialArrival = new Date(currentTime.getTime() + travelTime * 60_000);
      if (isDuringBreak(place.breakTimings, potentialArrival)) continue;

      // 2. Difficulty & Fatigue Constraints
      // Elderly group skips hard places entirely
      if (input.groupType === 'elderly' && place.difficulty === 'hard') {
        continue;
      }

      // Prevent back-to-back hard places
      const lastStop = stops[stops.length - 1];
      if (lastStop) {
        const prevPlace = allPlaces.find(pl => pl.id === lastStop.placeId);
        const isPrevHard = prevPlace?.difficulty === 'hard';
        const isCurrentHard = place.difficulty === 'hard';
        if (isPrevHard && isCurrentHard) continue;
      }

      // PRD: Proportional Blending / Diversity Bonus
      let diversityBonus = 1.0;
      const representedInterests = new Set(stops.flatMap(s => {
        const p = allPlaces.find(pl => pl.id === s.placeId);
        return p ? p.interests : [];
      }));
      
      const newInterests = place.interests.filter(i => !representedInterests.has(i));
      if (newInterests.length > 0) diversityBonus = 1.25; // 25% boost for new variety

      const efficiency = (Math.max(place.score, 1) * diversityBonus) / totalNeeded;

      if (efficiency > bestEfficiency) {
        bestEfficiency = efficiency;
        bestNext = place;
        bestTravelTime = travelTime;
        bestTotalNeeded = totalNeeded;
      }
    }

    if (!bestNext) break;

    const arrival   = new Date(currentTime.getTime() + bestTravelTime * 60_000);
    const departure = new Date(arrival.getTime()     + bestNext.durationMins * 60_000);

    stops.push({
      placeId:       bestNext.id,
      arrivalTime:   arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      departureTime: departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      travelToNext:  bestTravelTime,
      travelMode,
      estimatedCost: bestNext.entryFeeNum,
    });

    highlights.push(bestNext.name);
    totalCost     += bestNext.entryFeeNum;
    remainingTime -= bestTotalNeeded;
    currentTime    = departure;
    currentDist    = bestNext.distanceKms;
  }

  // Fallback — if 0 stops (shouldn't happen), take top-2 nearby
  if (stops.length === 0) {
    const fallback = [...scoredPool]
      .filter(p => !excludeIds.has(p.id) && p.distanceKms < 25)
      .slice(0, 2);

    for (const place of fallback) {
      const travelTime = Math.max(10, Math.round(place.distanceKms * 3));
      const arrival    = new Date(currentTime.getTime() + travelTime * 60_000);
      const departure  = new Date(arrival.getTime()     + place.durationMins * 60_000);

      stops.push({
        placeId:       place.id,
        arrivalTime:   arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        departureTime: departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        travelToNext:  travelTime,
        travelMode,
        estimatedCost: place.entryFeeNum,
      });
      highlights.push(place.name);
      totalCost  += place.entryFeeNum;
      currentTime = departure;
    }
  }

  const usedMins = timeMins - remainingTime;

  const META = {
    best:    { title: 'Best Match',  emoji: '⭐', tagline: 'Balanced plan — highest value with smart routing.' },
    budget:  { title: 'Budget Pick', emoji: '💰', tagline: 'Spend smart — free & cheap spots, more stops.' },
    premium: { title: 'Premium Path', emoji: '✨', tagline: 'Exclusive picks — high-rated, unique, and rare.' },
  };

  return {
    type,
    ...META[type],
    stops,
    totalMins:  Math.max(usedMins, 10),
    totalCost,
    highlights: highlights.slice(0, 3),
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generatePlans(
  rawInput: PlannerInput | null | undefined,
  availablePlaces: Place[] = PLACES
): { plans: Plan[]; recommendations: (Place & { score: number })[] } {
  const input    = safeInput(rawInput);
  const expanded = expandInterests(input.interests);
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

  // PRD: STRICT INTENT FILTERING
  const filteredPlaces = filterByIntent(availablePlaces, input.interests, expanded);

  // Weekend crowd penalty applied here
  const weekendPenalty = (p: Place) =>
    isWeekend && p.isMustVisit && p.reviewCount > 20000 ? -8 : 0;

  // ── Score each pool differently ─────────────────────────────────────────────

  const sortedBest = filteredPlaces
    .map(p => ({ ...p, score: scoreBest(p, baseScore(p, input, expanded)) + weekendPenalty(p) }))
    .sort((a, b) => b.score - a.score);

  const sortedBudget = poolBudget(filteredPlaces)
    .map(p => ({ ...p, score: scoreBudget(p, baseScore(p, input, expanded)) + weekendPenalty(p) }))
    .sort((a, b) => b.score - a.score);

  const sortedPremium = poolPremium(filteredPlaces)
    .map(p => ({ ...p, score: scorePremium(p, baseScore(p, input, expanded)) + weekendPenalty(p) }))
    .sort((a, b) => b.score - a.score);

  // ── Build Best plan first ────────────────────────────────────────────────────
  const bestPlan = buildRoute('best', sortedBest, input, availablePlaces);
  const bestIds  = new Set(bestPlan.stops.map(s => s.placeId));

  // ── Budget: exclude the top stops from Best so it's clearly different ────────
  // Allow up to 1 shared stop (e.g. a free must-visit)
  const budgetExclude = new Set(
    [...bestIds].filter((id, i) => i < Math.max(bestIds.size - 1, 0))
  );
  const budgetPlan = buildRoute('budget', sortedBudget, input, availablePlaces, budgetExclude);
  const budgetIds  = new Set(budgetPlan.stops.map(s => s.placeId));

  // ── Premium: exclude stops already in Best OR Budget ─────────────────────────
  const premiumExclude = new Set([...bestIds, ...budgetIds]);
  // But if the premium pool is too small after exclusion, relax — only exclude from best
  const premiumPool = sortedPremium.filter(p => !premiumExclude.has(p.id));
  const finalPremiumPool = premiumPool.length >= 3 ? sortedPremium : sortedPremium;
  const finalPremiumExclude = premiumPool.length >= 3 ? premiumExclude : bestIds;

  const premiumPlan = buildRoute('premium', finalPremiumPool, input, availablePlaces, finalPremiumExclude);

  // ── Recommendations = full base-scored list for the "You Might Like" section ─
  const recommendations = filteredPlaces
    .map(p => ({ ...p, score: baseScore(p, input, expanded) + weekendPenalty(p) }))
    .sort((a, b) => b.score - a.score);

  return {
    plans: [bestPlan, budgetPlan, premiumPlan],
    recommendations,
  };
}
