import { NextResponse } from 'next/server';
import { scorePlace, ContextInput } from '@/lib/contextEngine';
import { PLACES } from '@/data/places';
import { findNearestPlaceCandidates, isValidCoordinates, TIRUPATI_CENTER } from '@/lib/location';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rawLat = searchParams.get('lat');
  const rawLng = searchParams.get('lng');

  const hasLocation = rawLat !== null && rawLng !== null;
  const lat = parseFloat(rawLat || '13.6288');
  const lng = parseFloat(rawLng || '79.4192');

  // Root Cause 8: Explicit Location Check
  if (!hasLocation || !isValidCoordinates(lat, lng)) {
    return NextResponse.json({
      error: 'Location coordinates required',
      location_required: true,
      message: 'Please provide valid lat and lng parameters to calculate nearby recommendations.'
    }, { status: 400 });
  }

  const context: ContextInput = {
    lat,
    lng,
    time: searchParams.get('time') || '10:00',
    weather: searchParams.get('weather') || 'Sunny',
    temp: parseInt(searchParams.get('temp') || '28', 10),
    crowdLevel: searchParams.get('crowdLevel') || 'MEDIUM',
    dayOfWeek: searchParams.get('dayOfWeek') || 'Monday',
  };

  // Root Cause 1 & 2 & 6: Use single authoritative dataset PLACES & spatial candidate search for top 15 candidates
  const nearestCandidates = findNearestPlaceCandidates({ lat, lng }, PLACES, 35000).slice(0, 15);

  const scoredPlaces = nearestCandidates.map(({ place: p }) => {
    const liveStatus = (p as any).live_updates || { crowd_level: 'LOW', parking_status: 'AVAILABLE', rtc_status: 'NORMAL' };
    const alerts = (p as any).alerts || [];

    const { score, reasons, distanceKm, travelTimeMins, rank_tier } = scorePlace(
      p, liveStatus, alerts, context
    );

    if (score <= -100) return null;

    // Root Cause 7: Real Confidence Score based on verification tier & coordinate accuracy
    const confidence = p.verification?.confidenceScore ?? (p.coordinates?.primaryEntrance ? 98 : 90);

    return {
      rank_tier,
      score,
      confidence,
      place: {
        id: p.id,
        name: p.name,
        category: p.category,
        image: p.image,
        coordinates: p.coordinates
      },
      distance_km: distanceKm,
      travel_time_mins: travelTimeMins,
      reasons
    };
  }).filter(Boolean) as any[];

  scoredPlaces.sort((a, b) => b.score - a.score);

  const bestRightNow = scoredPlaces.length > 0 ? {
    place: scoredPlaces[0].place,
    reasons: scoredPlaces[0].reasons,
    distanceKm: scoredPlaces[0].distance_km,
    travelTimeMins: scoredPlaces[0].travel_time_mins
  } : null;

  const quickToReach = [...scoredPlaces]
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 5)
    .map(p => ({
      place: p.place,
      distanceKm: p.distance_km,
      travelTimeMins: p.travel_time_mins
    }));

  const hiddenGems = scoredPlaces
    .filter(p => p.place.category === 'Hidden Gem' || p.score >= 70)
    .slice(0, 5)
    .map(p => ({
      place: p.place,
      reason: p.reasons?.[0] || 'Recommended local spot'
    }));

  return NextResponse.json({
    bestRightNow,
    quickToReach,
    hiddenGems
  });
}

