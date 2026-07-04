import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { predictCrowdMetrics } from '@/utils/crowdPredictor';

export const dynamic = 'force-dynamic';

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch all festivals from Supabase that are >= today, ordered by date
  // Since we want the very next one, we can limit to 1
  const { data, error } = await supabase
    .from('festivals')
    .select('*')
    .gte('date', today.toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(1)
    .single();

  if (error || !data) {
    // If no upcoming festivals found or error, return fallback
    return NextResponse.json({
      error: 'No upcoming festivals found',
      details: error
    }, { status: 404 });
  }

  const fDate = new Date(data.date);
  fDate.setHours(0, 0, 0, 0);
  const diffTime = fDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine if target festival day (or today if checking current crowd) is a weekend
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  // Use the algorithmic crowd predictor
  const prediction = predictCrowdMetrics(
    data.gravity_score,
    daysRemaining,
    isWeekend
  );

  return NextResponse.json({
    festival: data,
    countdown: {
      daysRemaining: daysRemaining < 0 ? 0 : daysRemaining,
    },
    prediction: {
      expectedCrowd: prediction.crowdLevel,
      trafficAlert: prediction.trafficAlert,
      parking: prediction.parking,
      rawScore: prediction.rawScore
    }
  });
}
