import { Place } from '@/data/places';
import { DerivedContext } from '../context.builder';

export function calculateWeatherScore(place: Place, context: DerivedContext): { score: number; reason?: string; source?: string } {
  if (!context.featureFlags.weatherActive) return { score: 0 };

  const placeType = (place.placeType || '').toLowerCase();
  const category = (place.category || '').toLowerCase();
  const isOutdoor = placeType === 'nature' || placeType === 'viewpoint' || category.includes('nature');
  const isIndoor = placeType === 'indoor' || place.name.toLowerCase().includes('museum') || place.name.toLowerCase().includes('annaprasadam');

  if (context.weather === 'rain') {
    if (isOutdoor) {
      return { score: -80, reason: 'Heavy rain alert outdoors', source: 'IMD' };
    } else if (isIndoor) {
      return { score: 35, reason: 'Indoor facility safe from rain', source: 'IMD' };
    }
  } else if (context.weather === 'heatwave') {
    if (place.tags?.includes('Waterfall') || isIndoor) {
      return { score: 40, reason: 'Pleasant climate-controlled escape', source: 'IMD' };
    }
  }

  return { score: 15, reason: 'Pleasant weather', source: 'IMD' };
}
