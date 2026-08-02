import { useMemo } from 'react';
import { useTrip } from '@/components/TripContext';
import { calculateDrivingDistance } from '@/utils/location';

export function useFeaturedPlaces(places: any[], liveStatus: any, weatherTemp: string) {
  const { userLocation } = useTrip();

  const featuredPlace = useMemo(() => {
    if (!places || places.length === 0) return null;

    const currentHour = new Date().getHours();
    const tempNum = parseInt(weatherTemp, 10) || 27;
    const isRainy = liveStatus?.weather?.toLowerCase().includes('rain') || liveStatus?.weather?.toLowerCase().includes('shower');
    const isHeavyCrowd = liveStatus?.crowdLevel === 'high' || liveStatus?.crowdLevel === 'very-high';
    const isNight = currentHour >= 21 || currentHour < 5;

    let bestScore = -Infinity;
    let bestMatch = places[0];

    for (const p of places) {
      let score = (p.rating || 4.0) * 5 + (p.isMustVisit ? 10 : 0);

      const openFrom = p.openFrom ?? 6;
      const openTo = p.openTo ?? 20;
      const isOpenNow = currentHour >= openFrom && currentHour < openTo;
      if (!isOpenNow) {
        score -= 40;
        if (openFrom <= 6) score += 10;
      }

      if (userLocation && p.coordinates) {
        const isTirumalaSpot = p.id === 'srivari-temple' || p.location?.toLowerCase().includes('tirumala');
        const distKm = calculateDrivingDistance(
          userLocation.lat,
          userLocation.lng,
          p.coordinates.lat,
          p.coordinates.lng,
          isTirumalaSpot
        );
        if (distKm < 5) score += 35;
        else if (distKm < 15) score += 20;
        else if (distKm < 30) score += 10;
        else score -= 10;
      }

      if (isOpenNow) {
        if (isRainy) {
          if (p.placeType === 'historical' || p.category?.toLowerCase().includes('museum')) {
            score += 30;
          } else if (p.placeType === 'nature' || p.placeType === 'water') {
            score -= 15;
          }
        } else if (tempNum > 30) {
          if (p.category?.toLowerCase().includes('museum') || p.id.includes('museum')) {
            score += 25;
          }
        } else {
          if (p.placeType === 'nature' || p.placeType === 'water') {
            score += 20;
          }
        }
      }

      if (isOpenNow) {
        if (currentHour >= 5 && currentHour < 12) {
          if (p.placeType === 'spiritual') score += 25;
        } else if (currentHour >= 12 && currentHour < 16) {
          if (p.category?.toLowerCase().includes('museum') || p.placeType === 'historical') score += 25;
        } else if (currentHour >= 16 && currentHour < 21) {
          if (p.placeType === 'leisure' || p.placeType === 'nature' || p.placeType === 'historical') score += 25;
        }
      } else if (isNight) {
        if (p.placeType === 'spiritual') score += 15;
      }

      if (isHeavyCrowd) {
        if (p.id === 'srivari-temple') score -= 25;
        else if (p.category === 'Core Temple' && p.id !== 'srivari-temple') score += 15;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = p;
      }
    }

    return bestMatch || places[0];
  }, [places, userLocation, weatherTemp, liveStatus]);

  const featuredPlaceDistance = useMemo(() => {
    if (!featuredPlace?.coordinates) return '12 mins away';
    if (!userLocation) return '12 mins away';

    const isTirumalaSpot = featuredPlace.id === 'srivari-temple' || featuredPlace.location?.toLowerCase().includes('tirumala');
    const distKm = calculateDrivingDistance(
      userLocation.lat,
      userLocation.lng,
      featuredPlace.coordinates.lat,
      featuredPlace.coordinates.lng,
      isTirumalaSpot
    );

    if (distKm < 1.5) {
      const walkMins = Math.max(1, Math.round(distKm * 12));
      return `${walkMins} min walk (${distKm} km)`;
    } else {
      const driveMins = Math.max(1, Math.round(distKm * 1.8));
      return `${driveMins} mins away (${distKm} km)`;
    }
  }, [featuredPlace, userLocation]);

  return { featuredPlace, featuredPlaceDistance };
}
