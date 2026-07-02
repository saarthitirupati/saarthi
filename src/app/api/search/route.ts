import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ places: [], stories: [], encyclopedia: [] });
    }

    const cleanQuery = q.trim();

    // Query in parallel
    const [placesRes, storiesRes, encyclopediaRes] = await Promise.all([
      supabase
        .from('places')
        .select('*')
        .or(`name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,history.ilike.%${cleanQuery}%,location.ilike.%${cleanQuery}%`),
      supabase
        .from('stories')
        .select('*')
        .eq('isActive', true)
        .or(`title.ilike.%${cleanQuery}%,subtitle.ilike.%${cleanQuery}%,snippet.ilike.%${cleanQuery}%,fullText.ilike.%${cleanQuery}%`),
      supabase
        .from('encyclopedia')
        .select('*')
        .eq('isActive', true)
        .or(`title.ilike.%${cleanQuery}%,content.ilike.%${cleanQuery}%,summary.ilike.%${cleanQuery}%`)
    ]);

    return NextResponse.json({
      places: placesRes.data || [],
      stories: storiesRes.data || [],
      encyclopedia: encyclopediaRes.data || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
