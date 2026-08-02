/**
 * Section Builder (UI Decoupled)
 * Accepts scored places and constructs presentation UI sections.
 */

import { ScoredPlace } from './decision.engine';
import { formatRecommendation, FormattedRecommendation } from './explainability.engine';

export interface UISection {
  id: string;
  title: string;
  subtitle: string;
  items: FormattedRecommendation[];
}

export function buildUISections(scoredPlaces: ScoredPlace[]): UISection[] {
  // 0. Filter out food/dining/restaurants/sweets/bakeries from attraction sections
  const nonFoodPlaces = scoredPlaces.filter(sp => {
    const cat = (sp.place.category || '').toLowerCase();
    const pType = (sp.place.placeType || '').toLowerCase();
    const nm = (sp.place.name || '').toLowerCase();
    const tags = (sp.place.tags || []).map(t => (typeof t === 'string' ? t : (t as any)?.name || '').toLowerCase());

    const isFoodOrSweets = 
      cat.includes('food') || cat.includes('restaurant') || cat.includes('dining') || cat.includes('sweet') || cat.includes('bakery') || cat.includes('snack') ||
      pType === 'food' || pType === 'sweets' || pType === 'bakery' ||
      nm.includes('sweet') || nm.includes('bakery') || nm.includes('mithai') || nm.includes('laddu') || nm.includes('hotel') || nm.includes('viceroy') || nm.includes('bhavan') || nm.includes('mess') || nm.includes('restaurant') ||
      tags.some(t => ['sweets', 'bakery', 'food', 'snacks', 'dessert', 'mithai'].includes(t));

    return !isFoodOrSweets;
  });

  // Deduplicate by normalized place name & place ID
  const seenNames = new Set<string>();
  const seenIds = new Set<string>();
  const uniquePlaces: ScoredPlace[] = [];

  for (const sp of nonFoodPlaces) {
    const rawName = (sp.place.name || '').toLowerCase().trim();
    const rawId = (sp.place.id || '').toLowerCase().trim();
    const cleanName = rawName.replace(/^(sri|the)\s+/, '').replace(/[^a-z0-9]/g, '');

    if (!seenNames.has(cleanName) && !seenIds.has(rawId)) {
      seenNames.add(cleanName);
      if (rawId) seenIds.add(rawId);
      uniquePlaces.push(sp);
    }
  }

  // 1. Best Right Now (Top 5 highest score overall)
  const bestRightNow = uniquePlaces
    .slice(0, 5)
    .map((sp, idx) => formatRecommendation(sp, idx + 1));

  // 2. Quick to Reach (Sorted by distance & travel time)
  const quickToReach = [...uniquePlaces]
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 6)
    .map((sp, idx) => formatRecommendation(sp, idx + 1));

  // 3. Hidden Gems (Filter by hidden gem criteria / serene spots)
  const hiddenGems = uniquePlaces
    .filter(sp => {
      const pType = (sp.place.placeType || '').toLowerCase();
      const tags = (sp.place.tags || []).map(t => t.toLowerCase());
      return sp.place.isHiddenGem || pType === 'hidden' || tags.includes('peaceful') || tags.includes('nature');
    })
    .slice(0, 5)
    .map((sp, idx) => formatRecommendation(sp, idx + 1));

  return [
    {
      id: 'best_right_now',
      title: '⭐ Best Right Now',
      subtitle: 'Curated for your location, live weather & crowd levels',
      items: bestRightNow
    },
    {
      id: 'quick_to_reach',
      title: '⭐ Quick to Reach',
      subtitle: 'Optimal travel time & live context right now',
      items: quickToReach
    },
    {
      id: 'hidden_gems',
      title: 'Hidden Gems',
      subtitle: 'Quiet & serene spots selected by decision engine',
      items: hiddenGems
    }
  ];
}
