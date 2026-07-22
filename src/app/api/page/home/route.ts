import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Fetch feature flags
    const { data: flagsData } = await supabase.from('feature_flags').select('name, isEnabled');
    const featureFlags = flagsData?.reduce((acc: any, flag) => {
      // Convert "Explore V2" to "exploreV2" or "explore_v2". We'll just map by lowercase key.
      const key = flag.name.toLowerCase().replace(/ /g, '_');
      acc[key] = flag.isEnabled;
      return acc;
    }, {}) || {};

    // 2. Fetch recommendation rules
    const { data: rulesData } = await supabase
      .from('recommendation_rules')
      .select('*')
      .eq('isEnabled', true)
      .order('weight', { ascending: false });

    // Derive context (mocking logic here for demonstration: assuming Morning and Clear weather)
    // In production, derive from actual server time/weather service
    const currentContext = {
      time: "Morning",
      weather: "Clear"
    };

    // 3. Fetch places for recommendations
    // For "Best Right Now", we'll just fetch a few highly-rated places for demo
    const { data: bestPlaces } = await supabase
      .from('places')
      .select('id, name, slug, hero_image, images, tags, coordinates, verification_status')
      .eq('isActive', true)
      .limit(3);

    // Format items
    const formattedBestPlaces = bestPlaces?.map(place => ({
      id: place.id,
      slug: place.slug,
      name: place.name,
      heroImage: place.hero_image || (place.images && place.images[0]) || '',
      distance: 2.5, // Mocked for now (Frontend/geo logic could calculate it)
      travelTime: 12,
      verified: place.verification_status || 'Recently',
      reasons: ['Pleasant weather', 'Low crowd']
    })) || [];

    // 4. Compose Response Sections
    const sections = [];

    // Section 1: Live Card
    sections.push({
      id: 'home_live_card',
      type: 'live_card',
      title: 'Tirumala Live Updates',
      subtitle: 'Current conditions and wait times',
      priority: 1,
      layout: 'status_card',
      items: [
        {
          id: 'live-1',
          name: 'Free Darshan Wait',
          status: '12-16 hours',
          trend: 'increasing'
        }
      ]
    });

    // Section 2: Best Right Now
    if (featureFlags['recommendation_engine']) {
      sections.push({
        id: 'home_best_right_now',
        type: 'best_right_now',
        title: 'Best Right Now',
        subtitle: `${currentContext.time} • ${currentContext.weather}`,
        priority: 2,
        layout: 'hero_card',
        items: formattedBestPlaces
      });
    }

    // Section 3: Essentials (if feature flag is on or just included)
    sections.push({
      id: 'home_essentials_quick',
      type: 'essentials_quick',
      title: 'Quick Essentials',
      subtitle: 'What you need to know',
      priority: 3,
      layout: 'grid_card',
      items: [
        { id: 'ess-1', name: 'Dress Code', icon: 'shirt' },
        { id: 'ess-2', name: 'Luggage Centers', icon: 'baggage' }
      ]
    });

    const response = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      cache: {
        ttl: 300
      },
      featureFlags,
      context: currentContext,
      sections
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error composing home page:", error);
    return NextResponse.json({ error: "Failed to compose home page" }, { status: 500 });
  }
}
