import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateDistance, TIRUPATI_CENTER } from '@/utils/location';
import { PLACES } from '@/data/places';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  
  const userLat = latParam ? parseFloat(latParam) : null;
  const userLng = lngParam ? parseFloat(lngParam) : null;

  try {
    const candidates = [];

    // 1. Fetch live metrics
    const { data: metrics } = await supabase.from('live_metrics').select('*').eq('id', 1).single();
    
    // Check for Critical Alerts (Score 100)
    if (metrics?.crowd_wait_minutes > 120) {
      candidates.push({
        id: 'critical_crowd',
        type: 'alert',
        score: 100,
        title: 'Heavy Crowd at Tirumala',
        subtitle: `Expected Wait: ${Math.round(metrics.crowd_wait_minutes / 60)} Hours`,
        description: 'Consider visiting after 5 PM.',
        actionText: 'View Live Status',
        actionLink: '/live',
        color: 'red'
      });
    }

    // 2. Fetch upcoming festival
    const { data: festivals } = await supabase
      .from('festivals')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(1);

    if (festivals && festivals.length > 0) {
      const festival = festivals[0];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const festivalDate = new Date(festival.date);
      const diffTime = Math.abs(festivalDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        candidates.push({
          id: 'upcoming_festival',
          type: 'festival',
          score: 90 - (diffDays * 0.1), // Prioritize closer festivals
          title: festival.name,
          subtitle: diffDays === 0 ? 'Starts Today' : diffDays === 1 ? 'Starts Tomorrow' : `Starts in ${diffDays} Days`,
          description: festival.description || `Expected crowd: High. Recommended time: ${festival.recommended_time || 'Early Morning'}`,
          actionText: 'Festival Guide',
          actionLink: `/festivals/${festival.slug || festival.id}`,
          color: 'orange'
        });
      }
    }

    // 3. Fetch Weather
    try {
      const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.6288&longitude=79.4192&current=temperature_2m,precipitation', { next: { revalidate: 300 } });
      if (weatherRes.ok) {
        const weatherData = await weatherRes.json();
        const temp = weatherData.current.temperature_2m;
        const precip = weatherData.current.precipitation;
        
        if (temp >= 18 && temp <= 26 && precip === 0) {
          candidates.push({
            id: 'perfect_weather',
            type: 'weather',
            score: 85,
            title: 'Perfect Weather Today',
            subtitle: `${temp}°C & Clear Sky`,
            description: 'Ideal conditions to visit nature spots like Talakona Waterfalls.',
            actionText: 'Plan Trip',
            actionLink: '/explore?q=Nature',
            color: 'sky'
          });
        }
      }
    } catch (e) {
      console.error('Spotlight weather error:', e);
    }

    // 4. Nearby Discovery
    if (userLat && userLng) {
      const closestPlaces = PLACES.map(p => ({
        ...p,
        distance: calculateDistance(userLat, userLng, p.coordinates?.lat || TIRUPATI_CENTER.lat, p.coordinates?.lng || TIRUPATI_CENTER.lng)
      })).filter(p => p.distance < 5).sort((a, b) => a.distance - b.distance);

      if (closestPlaces.length > 0) {
        const closest = closestPlaces[0];
        candidates.push({
          id: 'nearby_place',
          type: 'nearby',
          score: 70,
          title: 'You are very close!',
          subtitle: `Only ${closest.distance.toFixed(1)} km from ${closest.name}`,
          description: 'A perfect time to visit this highly-rated spot.',
          actionText: 'Directions',
          actionLink: `/place/${closest.id}`,
          color: 'emerald'
        });
      }
    }

    // 5. Weekend Suggestion
    const currentDay = new Date().getDay();
    if (currentDay === 5 || currentDay === 6 || currentDay === 0) {
      candidates.push({
        id: 'weekend_plan',
        type: 'weekend',
        score: 60,
        title: 'Weekend Gateway',
        subtitle: 'Perfect time for a local tour',
        description: 'Explore the hidden heritage sites of Chandragiri.',
        actionText: 'View Guide',
        actionLink: '/explore?q=Heritage',
        color: 'purple'
      });
    }

    // 6. Daily Learning (Always available as fallback)
    candidates.push({
      id: 'daily_story',
      type: 'story',
      score: 30,
      title: 'Did You Know?',
      subtitle: 'The Story of Kapila Theertham',
      description: 'Discover the ancient legend of the underground Shiva Lingam.',
      actionText: 'Read in 30 Seconds',
      actionLink: '/learn/story-of-the-day',
      color: 'indigo'
    });

    // Pick the highest scoring candidate
    candidates.sort((a, b) => b.score - a.score);
    const spotlightCard = candidates[0];

    return NextResponse.json({ spotlight: spotlightCard });
  } catch {
    return NextResponse.json({ error: 'Failed to generate spotlight' }, { status: 500 });
  }
}
