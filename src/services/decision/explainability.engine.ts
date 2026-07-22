/**
 * Explainability & Confidence Engine
 * Computes overall confidence percentage (%) and formats attributed reasons.
 */

import { ScoredPlace } from './decision.engine';

export interface FormattedRecommendation {
  rank: number;
  id: string;
  name: string;
  category: string;
  score: number;
  confidence: number;
  distance: string;
  travelTime: string;
  image: string;
  reasons: { label: string; source: string; confidence: number }[];
}

export function formatRecommendation(scored: ScoredPlace, rank: number): FormattedRecommendation {
  const travelMins = Math.max(2, Math.round(scored.distanceKm * 2.2));
  
  // Calculate average confidence % from reason sources
  const confSum = scored.reasons.reduce((acc, r) => acc + r.confidence, 0);
  const confidence = scored.reasons.length > 0 ? Math.round(confSum / scored.reasons.length) : 90;

  return {
    rank,
    id: scored.place.id,
    name: scored.place.name,
    category: scored.place.category || 'Spiritual',
    score: scored.totalScore,
    confidence,
    distance: `${scored.distanceKm.toFixed(1)} km`,
    travelTime: `${travelMins} mins`,
    image: scored.place.image || '/assets/temples/kapila-theertham.png',
    reasons: scored.reasons.slice(0, 4)
  };
}
