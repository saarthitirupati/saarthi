import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Fetch place and its details using a join
    const { data: placeData, error } = await supabase
      .from('places')
      .select(`
        id,
        name,
        slug,
        description,
        coordinates,
        images,
        hero_image,
        tags,
        verification_status,
        place_details (
          history,
          interestingFacts,
          mythology,
          travelTips,
          dressCode,
          faqs,
          bestTime,
          updatedAt
        )
      `)
      .eq('slug', slug)
      .eq('isActive', true)
      .single();

    if (error || !placeData) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // Fetch related active stories/live updates (mocked structure for now)
    // In production: fetch from 'stories' and 'live_updates' tables filtering by place_id
    const stories: any[] = [];
    const liveUpdates: any[] = [];

    const response = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      cache: {
        ttl: 600
      },
      data: {
        ...placeData,
        stories,
        liveUpdates
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching place:", error);
    return NextResponse.json({ error: "Failed to fetch place" }, { status: 500 });
  }
}
