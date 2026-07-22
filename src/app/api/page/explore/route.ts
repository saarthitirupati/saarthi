import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: flagsData } = await supabase.from('feature_flags').select('name, isEnabled');
    const featureFlags = flagsData?.reduce((acc: any, flag) => {
      const key = flag.name.toLowerCase().replace(/ /g, '_');
      acc[key] = flag.isEnabled;
      return acc;
    }, {}) || {};

    const currentContext = {
      city: "Tirupati",
      weather: "Sunny",
      time: "Morning"
    };

    const sections = [];

    // 1. Context Strip
    sections.push({
      id: 'explore_context_strip',
      type: 'context_strip',
      priority: 1,
      items: [
        { id: 'loc', icon: 'pin', text: 'Near Railway Station' },
        { id: 'weather', icon: 'sun', text: '29°C' },
        { id: 'time', icon: 'clock', text: 'Morning' }
      ]
    });

    // 2. Search Section
    sections.push({
      id: 'explore_search',
      type: 'search_bar',
      priority: 2,
      placeholder: 'Search places, aliases...',
      items: []
    });

    // 3. Decision Cards
    sections.push({
      id: 'explore_decision_cards',
      type: 'decision_cards',
      title: 'What are you looking for?',
      priority: 3,
      layout: 'horizontal_cards',
      items: [
        { id: 'time-2h', name: 'I have only 2 hours', icon: 'clock' },
        { id: 'family', name: 'I am with family', icon: 'users' },
        { id: 'peaceful', name: 'I want peaceful places', icon: 'leaf' },
        { id: 'free', name: 'Free places', icon: 'wallet' }
      ]
    });

    // 4. Best Right Now (Mocked recommendation)
    const { data: bestPlaces } = await supabase
      .from('places')
      .select('id, name, slug, hero_image, images, verification_status')
      .eq('isActive', true)
      .limit(1);

    sections.push({
      id: 'explore_best_right_now',
      type: 'best_right_now',
      title: 'Best Right Now',
      priority: 4,
      layout: 'hero_card',
      items: bestPlaces?.map(place => ({
        id: place.id,
        slug: place.slug,
        name: place.name,
        heroImage: place.hero_image || (place.images && place.images[0]) || '',
        distance: 1.4,
        travelTime: 8,
        verified: place.verification_status || 'Yesterday',
        reasons: ['Pleasant weather', 'Low crowd'],
        confidence: 94
      })) || []
    });

    // 5. Choose Your Experience
    sections.push({
      id: 'explore_experiences',
      type: 'experiences',
      title: 'Choose Your Experience',
      priority: 5,
      layout: 'grid_card',
      items: [
        { id: 'temples', name: 'Temples', icon: 'landmark' },
        { id: 'nature', name: 'Nature', icon: 'leaf' },
        { id: 'heritage', name: 'Heritage', icon: 'book' },
        { id: 'waterfalls', name: 'Waterfalls', icon: 'waves' }
      ]
    });

    // 6. Quick To Reach
    const { data: quickPlaces } = await supabase
      .from('places')
      .select('id, name, slug, hero_image, images, verification_status')
      .eq('isActive', true)
      .limit(3);

    sections.push({
      id: 'explore_quick_to_reach',
      type: 'quick_to_reach',
      title: 'Quick To Reach',
      subtitle: 'Sorted by distance',
      priority: 6,
      layout: 'horizontal_list',
      items: quickPlaces?.map(place => ({
        id: place.id,
        slug: place.slug,
        name: place.name,
        heroImage: place.hero_image || (place.images && place.images[0]) || '',
        distance: 2.1,
        travelTime: 12
      })) || []
    });

    // 7. Hidden Gems
    const { data: hiddenPlaces } = await supabase
      .from('places')
      .select('id, name, slug, hero_image, images, verification_status')
      .eq('isActive', true)
      .limit(2);

    sections.push({
      id: 'explore_hidden_gems',
      type: 'hidden_gems',
      title: 'Hidden Gems',
      priority: 7,
      layout: 'vertical_list',
      items: hiddenPlaces?.map(place => ({
        id: place.id,
        slug: place.slug,
        name: place.name,
        heroImage: place.hero_image || (place.images && place.images[0]) || '',
        distance: 8.5,
        reasons: ['Curated by locals']
      })) || []
    });

    const response = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      cache: {
        ttl: 600
      },
      featureFlags,
      context: currentContext,
      sections
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error composing explore page:", error);
    return NextResponse.json({ error: "Failed to compose explore page" }, { status: 500 });
  }
}
