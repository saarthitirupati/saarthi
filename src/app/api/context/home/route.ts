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

    // 1. Collect Signals
    const signals = await collectRawSignals({ lat, lng, journeyStage });

    // 2. Build Context
    const context = buildDerivedContext(signals);

    // 3. Fetch Live Places (excluding deleted places)
    const livePlaces = await fetchLivePlaces();

    // 4. Process Decision Engine Scoring
    const scoredPlaces = processDecisionEngine(livePlaces, context);

    // 4. Build UI Sections
    const sections = buildUISections(scoredPlaces);

    // 5. Format API Response
    const responseData = buildApiResponse(context, sections);

    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Decision Engine Error'
    }, { status: 500 });
  }
}
