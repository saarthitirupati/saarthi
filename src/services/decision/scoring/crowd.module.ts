import { Place } from '@/data/places';
import { DerivedContext } from '../context.builder';

export function calculateCrowdScore(place: Place, context: DerivedContext): { score: number; reason?: string; source?: string } {
  if (!context.featureFlags.crowdActive) return { score: 0 };

  const isTirumalaHill = (place.location || '').toLowerCase().includes('tirumala') || place.id === 'venkateswara';
  const isFoothillEscape = place.id === 'kapila-theertham' || place.id === 'padmavathi' || place.id === 'sv-museum';

  if (context.crowdLevel === 'extreme') {
    if (isTirumalaHill) {
      return { score: -50, reason: 'Extreme wait times at hilltop', source: 'Live Crowd Update' };
    }
    if (isFoothillEscape) {
      return { score: 40, reason: 'Low crowd foothill alternative', source: 'Live Crowd Update' };
    }
  } else if (context.crowdLevel === 'low') {
    return { score: 30, reason: 'Low crowd right now', source: 'Live Crowd Update' };
  }

  return { score: 15, reason: 'Moderate crowd', source: 'Live Crowd Update' };
}
