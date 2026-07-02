import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Get all active stories
    const { data: stories } = await supabase
      .from('stories')
      .select('*')
      .eq('isActive', true);

    // 2. Get all active quizzes
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('*')
      .eq('isActive', true);

    // 3. Get must-visit places for the spotlight
    const { data: places } = await supabase
      .from('places')
      .select('*')
      .eq('isMustVisit', true);

    // 4. Get upcoming major festivals
    const { data: festivals } = await supabase
      .from('festivals')
      .select('*')
      .gte('date', todayStr)
      .order('date', { ascending: true })
      .limit(3);

    // Deterministic indexing based on day stamp
    const dayStamp = Math.floor(Date.now() / 86400000);

    const story = stories && stories.length > 0
      ? stories[dayStamp % stories.length]
      : null;

    const quiz = quizzes && quizzes.length > 0
      ? quizzes[dayStamp % quizzes.length]
      : null;

    const spotlight = places && places.length > 0
      ? places[dayStamp % places.length]
      : null;

    const festival = festivals && festivals.length > 0
      ? festivals[0]
      : null;

    return NextResponse.json({
      story,
      quiz,
      spotlight,
      festival,
      upcomingFestivals: festivals || [],
      learn: {
        storyOfTheDay: story
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
