import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    const searchQuery = query.toLowerCase().trim();

    // 1. Check Search Aliases
    let actualSearchTerm = searchQuery;
    const { data: aliasData } = await supabase
      .from('search_aliases')
      .select('targetTerm')
      .eq('alias', searchQuery)
      .single();

    if (aliasData) {
      actualSearchTerm = aliasData.targetTerm;
    }

    // 2. Perform search (Exact -> Tag -> Category -> Desc)
    // For now, doing an ilike match on name, tags, or description as a basic implementation.
    // Production will use a more robust Postgres Full Text Search (tsvector).
    const { data: places, error } = await supabase
      .from('places')
      .select('id, name, slug, hero_image, images, verification_status')
      .eq('isActive', true)
      .or(`name.ilike.%${actualSearchTerm}%,tags.cs.{${actualSearchTerm}}`)
      .limit(10);

    if (error) {
       console.error("Search error:", error);
    }

    const formattedResults = places?.map(place => ({
      id: place.id,
      slug: place.slug,
      name: place.name,
      heroImage: place.hero_image || (place.images && place.images[0]) || '',
      verified: place.verification_status || 'Recently',
    })) || [];

    const response = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      cache: {
        ttl: 60 // Shorter TTL for search
      },
      data: {
        query: searchQuery,
        resolvedTo: actualSearchTerm !== searchQuery ? actualSearchTerm : null,
        results: formattedResults
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error performing search:", error);
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
  }
}
