import { NextResponse } from 'next/server';
import { scorePlace, ContextInput } from '@/lib/contextEngine';
import { mockPlacesDb } from '@/app/api/context/recommendations/mockDb'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Reconstruct context from query params
  const context: ContextInput = {
    lat: parseFloat(searchParams.get('lat') || '13.6288'),
    lng: parseFloat(searchParams.get('lng') || '79.4192'),
    time: searchParams.get('time') || '10:00',
    weather: searchParams.get('weather') || 'Sunny',
    temp: parseInt(searchParams.get('temp') || '28', 10),
    crowdLevel: searchParams.get('crowdLevel') || 'MEDIUM',
    dayOfWeek: searchParams.get('dayOfWeek') || 'Monday',
  };

  const places = mockPlacesDb; 

  const scoredPlaces = places.map(p => {
    const liveStatus = p.live_updates || { crowd_level: 'LOW', parking_status: 'AVAILABLE', rtc_status: 'NORMAL' };
    const alerts = p.alerts || [];

    const { score, reasons, distanceKm, travelTimeMins, rank_tier } = scorePlace(
      p, liveStatus, alerts, context
    );

    // Skip closed places entirely (Rule: Priority Open > Safe > Reachable...)
    // A score of -100 typically means closed or strictly avoid.
    if (score <= -100) return null;

    return {
      place: p,
      score,
      reasons,
      distanceKm,
      travelTimeMins,
      rank_tier
    };
  }).filter(Boolean) as any[];

  // Sort by highest score first
  scoredPlaces.sort((a, b) => b.score - a.score);

  // Group into sections
  const bestRightNow = scoredPlaces.length > 0 ? {
    place: scoredPlaces[0].place,
    reasons: scoredPlaces[0].reasons,
    distanceKm: scoredPlaces[0].distanceKm,
    travelTimeMins: scoredPlaces[0].travelTimeMins
  } : null;

  // Quick to reach: sorted strictly by distance
  const quickToReach = [...scoredPlaces]
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 5)
    .map(p => ({
      place: p.place,
      distanceKm: p.distanceKm,
      travelTimeMins: p.travelTimeMins
    }));

  // Hidden Gems: places marked as hidden gem
  const hiddenGems = scoredPlaces
    .filter(p => p.place.isHiddenGem)
    .slice(0, 5)
    .map(p => ({
      place: p.place,
      reason: p.place.description // Simplified "why"
    }));

  return NextResponse.json({
    bestRightNow,
    quickToReach,
    hiddenGems
  });
}
