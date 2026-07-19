import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { predictCrowdMetrics } from '@/utils/crowdPredictor';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;

  const { data: festival, error } = await supabase
    .from('festivals')
    .select(`
      *,
      festival_updates (
        id, title, description, severity, created_at
      )
    `)
    .eq('slug', slug)
    .single();

  if (error || !festival) {
    return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fDate = new Date(festival.date);
  fDate.setHours(0, 0, 0, 0);
  const diffTime = fDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isWeekend = fDate.getDay() === 0 || fDate.getDay() === 6;

  // Use the algorithmic crowd predictor to give predictions for this specific festival
  const prediction = predictCrowdMetrics(
    festival.gravity_score,
    daysRemaining < 0 ? 0 : daysRemaining,
    isWeekend
  );

  return NextResponse.json({
    festival,
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
