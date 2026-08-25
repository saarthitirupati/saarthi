import { Place } from '@/data/places';
import { DerivedContext } from '../context.builder';
import { FESTIVALS_2026 } from '@/data/festivals';

export function calculateFestivalScore(place: Place, context: DerivedContext): { score: number; reason?: string; source?: string } {
  if (!context.featureFlags.festivalActive || !context.activeFestival) return { score: 0 };

  const festivalName = context.activeFestival.toLowerCase();
  const festival = FESTIVALS_2026.find(f => 
    f.name.toLowerCase() === festivalName || 
    festivalName.includes(f.name.toLowerCase()) || 
    f.name.toLowerCase().includes(festivalName)
  );

  if (festival) {
    // 1. Direct match: place is the primary festival venue
    if (festival.placeId === place.id) {
      const reason = `${festival.name} — Primary Sacred Celebrations & Pujas`;
      return { score: 60, reason, source: 'Telugu Calendar & TTD Schedule' };
    }

    // 2. Related temples match (e.g. Kapila Theertham & Srikalahasti on Shiva festivals, Tiruchanur on Lakshmi festivals)
    if (festival.relatedTemples && festival.relatedTemples.includes(place.id)) {
      const reason = `${festival.name} — Connected Holy Shrine Festivities`;
      return { score: 40, reason, source: 'Telugu Calendar' };
    }
  }

  // Fallback for deity/tradition heuristics
  if (festivalName.includes('shivaratri') && (place.id === 'kapila-theertham' || place.id === 'srikalahasti' || place.id === 'parasurameswara-temple')) {
    return { score: 50, reason: 'Special Maha Shivaratri Darshan & Festivities', source: 'TTD Calendar' };
  }

  return { score: 0 };
}

