import { NextResponse } from 'next/server';
import { scorePlace, ContextInput } from '@/lib/contextEngine';
// Mock database connection for the API until Supabase client is hooked up
import { mockPlacesDb } from './mockDb'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Extract context from URL parameters
  const context: ContextInput = {
    lat: parseFloat(searchParams.get('lat') || '13.6288'), // Default Tirupati
    lng: parseFloat(searchParams.get('lng') || '79.4192'),
    time: searchParams.get('time') || '10:00',
    weather: searchParams.get('weather') || 'Sunny',
    temp: parseInt(searchParams.get('temp') || '28', 10),
    crowdLevel: searchParams.get('crowdLevel') || 'MEDIUM',
    dayOfWeek: searchParams.get('dayOfWeek') || 'Monday',
  };

  // 1. Fetch all places from Layer 1 & 2 (Mocked here for now)
  const places = mockPlacesDb; 

  // 2. Map and score each place
  const scoredPlaces = places.map(p => {
    const liveStatus = p.live_updates || { crowd_level: 'LOW', parking_status: 'AVAILABLE', rtc_status: 'NORMAL' };
    const alerts = p.alerts || [];

    const { score, reasons, distanceKm, travelTimeMins, rank_tier } = scorePlace(
      p, liveStatus, alerts, context
    );

    // Calculate a confidence score (for analytics)
    const confidence = Math.min(100, Math.max(0, 50 + (score / 4)));

    return {
      rank_tier, // Filled later
      score,
      confidence,
      place: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        hero_image: p.images?.[0] || '',
        coordinates: p.coordinates
      },
      distance_km: parseFloat(distanceKm.toFixed(1)),
      travel_time_mins: travelTimeMins,
      reasons
    };
  });

  // 3. Filter out unavailable places and sort by score descending
  const validPlaces = scoredPlaces
    .filter(p => p.score > -100) // Filter out road closures
    .sort((a, b) => b.score - a.score);

  // 4. Assign dynamic rank tiers
  if (validPlaces.length > 0) validPlaces[0].rank_tier = "BEST_RIGHT_NOW";
  if (validPlaces.length > 1) validPlaces[1].rank_tier = "ALTERNATIVE";
  if (validPlaces.length > 2) validPlaces[2].rank_tier = "HIDDEN_GEM";

  // Return top 3 recommendations
  return NextResponse.json({ recommendations: validPlaces.slice(0, 3) });
}
