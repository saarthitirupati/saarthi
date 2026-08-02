import { NextResponse } from 'next/server';
import { STORIES } from '@/data/stories';
import { FESTIVALS_2026 } from '@/data/festivals';
import { getTodaysCompanion } from '@/data/dailySpiritualEngine';

export async function GET() {
  const now = new Date();
  const day = now.getDate();
  const story = STORIES[day % STORIES.length];

  // Resolve today's festival (exact date match only → Priority 1)
  const todayStr = now.toISOString().split('T')[0];
  const todayFestival = FESTIVALS_2026.find(f => f.date === todayStr) ?? null;

  const todaysCompanion = getTodaysCompanion(now, undefined, 'general', todayFestival);

  return NextResponse.json({
    success: true,
    todaysCompanion,
    todayFestival,
    learn: { storyOfTheDay: story },
    story,
    allStories: STORIES
  });
}
