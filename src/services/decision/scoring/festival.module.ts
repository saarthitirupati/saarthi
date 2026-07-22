import { Place } from '@/data/places';
import { DerivedContext } from '../context.builder';

export function calculateFestivalScore(place: Place, context: DerivedContext): { score: number; reason?: string; source?: string } {
  if (!context.featureFlags.festivalActive || !context.activeFestival) return { score: 0 };

  if (context.activeFestival.toLowerCase().includes('shivaratri') && (place.id === 'kapila-theertham' || place.id === 'srikalahasti')) {
    return { score: 50, reason: 'Special Maha Shivaratri Darshan & Festivities', source: 'TTD Calendar' };
  }

  return { score: 0 };
}
