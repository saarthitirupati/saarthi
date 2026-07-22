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
  // 1. Best Right Now (Top 5 highest score overall)
  const bestRightNow = scoredPlaces
    .slice(0, 5)
    .map((sp, idx) => formatRecommendation(sp, idx + 1));

  // 2. Quick to Reach (Sorted by distance & travel time)
  const quickToReach = [...scoredPlaces]
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 5)
    .map((sp, idx) => formatRecommendation(sp, idx + 1));

  // 3. Hidden Gems (Filter by hidden gem criteria / serene spots)
  const hiddenGems = scoredPlaces
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
      title: 'Quick to Reach',
      subtitle: 'Optimal balance of travel time, parking & traffic',
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
