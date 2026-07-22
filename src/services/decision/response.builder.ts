/**
 * Response Builder
 * Formats API JSON payload with engine metadata and structured sections.
 */

import { DerivedContext } from './context.builder';
import { UISection } from './section.builder';

export function buildApiResponse(context: DerivedContext, sections: UISection[]) {
  return {
    success: true,
    meta: {
      engineVersion: '1.0.0',
      timestamp: new Date().toISOString()
    },
    context: {
      locationLabel: context.locationLabel,
      timeOfDay: context.timeOfDay,
      dayOfWeek: context.dayOfWeek,
      journeyStage: context.journeyStage,
      weather: context.weather,
      crowdLevel: context.crowdLevel,
      activeFestival: context.activeFestival,
      featureFlags: context.featureFlags
    },
    sections
  };
}
