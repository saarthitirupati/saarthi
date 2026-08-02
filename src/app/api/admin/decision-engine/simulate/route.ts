import { NextResponse } from 'next/server';
import { PLACES } from '@/data/places';
import { buildDerivedContext } from '@/services/decision/context.builder';
import { processDecisionEngine } from '@/services/decision/decision.engine';
import { buildUISections } from '@/services/decision/section.builder';
import { buildApiResponse } from '@/services/decision/response.builder';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Build Simulated Raw Signals
    const simulatedSignals = {
      gps: body.gps || { lat: 13.6288, lng: 79.4192 },
      timestamp: new Date().toISOString(),
      dayOfWeek: body.dayOfWeek || 'friday',
      timeHour: body.timeHour !== undefined ? body.timeHour : 9,
      weather: body.weather || 'rain',
      activeFestival: body.activeFestival || null,
      liveCrowdStatus: body.liveCrowdStatus || 'extreme',
      roadClosures: body.roadClosures || [],
      parkingStatus: body.parkingStatus || { 'vishnu-nivasam': 'available' },
      journeyStage: body.journeyStage || 'before_darshan'
    };

    // 2. Build Derived Context
    const context = buildDerivedContext(simulatedSignals as any);

    // 3. Process Decision Engine Scoring
    const scoredPlaces = processDecisionEngine(PLACES, context);

    // 4. Build UI Sections
    const sections = buildUISections(scoredPlaces);

    // 5. Format API Response
    const responseData = buildApiResponse(context, sections);

    return NextResponse.json({
      ...responseData,
      simulatedSignals
    });
  } catch (error: any) {
    console.error('Simulate API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Simulation Failed',
      stack: error.stack
    }, { status: 500 });
  }
}
