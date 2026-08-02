import { NextResponse } from 'next/server';
import { fetchLivePlaces } from '@/lib/placesSync';
import { collectRawSignals } from '@/services/decision/signals.service';
import { buildDerivedContext } from '@/services/decision/context.builder';
import { processDecisionEngine } from '@/services/decision/decision.engine';
import { buildUISections } from '@/services/decision/section.builder';
import { buildApiResponse } from '@/services/decision/response.builder';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || undefined;
    const lng = searchParams.get('lng') || undefined;
    const journeyStage = searchParams.get('journey_stage') || undefined;

    // 1. Collect Signals (Weather, Crowd, GPS, Time, Day)
    const signals = await collectRawSignals({ lat, lng, journeyStage });

    // 2. Build Context
    const context = buildDerivedContext(signals);

    // 3. Fetch Live Places
    const livePlaces = await fetchLivePlaces();

    // 4. Process MinMax Decision Engine Scoring
    const scoredPlaces = processDecisionEngine(livePlaces, context);

    // 5. Build UI Sections
    const decisionSections = buildUISections(scoredPlaces);

    // 6. Response
    const responseData = buildApiResponse(context, decisionSections);

    return NextResponse.json({
      ...responseData,
      sections: [
        {
          id: 'explore_search',
          type: 'search_bar',
          priority: 1,
          placeholder: 'Search temples, sacred places, waterfalls...'
        },
        {
          id: 'explore_categories',
          type: 'category_chips',
          priority: 2,
          items: [
            { id: 'all', name: 'All' },
            { id: 'temple', name: 'Temples' },
            { id: 'nature', name: 'Nature & Parks' },
            { id: 'heritage', name: 'Heritage' },
            { id: 'viewpoint', name: 'Viewpoints' }
          ]
        },
        {
          id: 'explore_situations',
          type: 'situational_chips',
          priority: 3,
          items: [
            { id: 'time-2h', name: 'I have only 2 hours', icon: 'clock' },
            { id: 'family', name: 'I am with family', icon: 'users' },
            { id: 'peaceful', name: 'I want peaceful places', icon: 'leaf' },
            { id: 'free', name: 'Free places', icon: 'wallet' }
          ]
        },
        ...decisionSections
      ]
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Decision Engine Error'
    }, { status: 500 });
  }
}
