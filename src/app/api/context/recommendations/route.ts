import { NextResponse } from 'next/server';
import { scorePlace, ContextInput } from '@/lib/contextEngine';
import { PLACES } from '@/data/places';
import { findNearestPlaceCandidates, isValidCoordinates } from '@/lib/location';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const rawLat = searchParams.get('lat');
  const rawLng = searchParams.get('lng');
  const hasLocation = rawLat !== null && rawLng !== null;

  const lat = parseFloat(rawLat || '13.6288');
  const lng = parseFloat(rawLng || '79.4192');

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

  // 1. Candidate spatial search for top 15 nearest places
  const nearestCandidates = findNearestPlaceCandidates({ lat, lng }, PLACES, 35000).slice(0, 15);

  // 2. Score candidate places dynamically
  const scoredPlaces = nearestCandidates.map(({ place: p }) => {
    const liveStatus = (p as any).live_updates || { crowd_level: 'LOW', parking_status: 'AVAILABLE', rtc_status: 'NORMAL' };
    const alerts = (p as any).alerts || [];

    const { score, reasons, distanceKm, travelTimeMins, rank_tier } = scorePlace(
      p, liveStatus, alerts, context
    );

    const confidence = p.verification?.confidenceScore ?? (p.coordinates?.primaryEntrance ? 98 : 90);

    return {
      rank_tier,
      score,
      confidence,
      place: {
        id: p.id,
        name: p.name,
        slug: (p as any).slug || p.id,
        hero_image: p.image || '',
        coordinates: p.coordinates
      },
      distance_km: distanceKm,
      travel_time_mins: travelTimeMins,
      reasons
    };
  });

  const validPlaces = scoredPlaces
    .filter(p => p.score > -100)
    .sort((a, b) => b.score - a.score);

  if (validPlaces.length > 0) validPlaces[0].rank_tier = "BEST_RIGHT_NOW";
  if (validPlaces.length > 1) validPlaces[1].rank_tier = "ALTERNATIVE";
  if (validPlaces.length > 2) validPlaces[2].rank_tier = "HIDDEN_GEM";

  return NextResponse.json({ recommendations: validPlaces.slice(0, 3) });
}

