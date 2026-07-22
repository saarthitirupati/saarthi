import { NextResponse } from 'next/server';
import { STORIES } from '@/data/stories';

export async function GET() {
  const day = new Date().getDate();
  const story = STORIES[day % STORIES.length];

  return NextResponse.json({
    success: true,
    learn: {
      storyOfTheDay: story
    },
    story: story,
    allStories: STORIES
  });
}
