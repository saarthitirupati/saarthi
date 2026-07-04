import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PLACES } from '@/data/places';
import { STORIES } from '@/data/stories';
import { FESTIVALS_2026 } from '@/data/festivals';

export async function POST() {
  try {
    // Fetch 1 row to get valid schema keys
    const { data: schemaRow } = await supabase.from('places').select('*').limit(1);
    
    let cleanPlaces: any[] = PLACES;
    
    if (schemaRow && schemaRow.length > 0) {
      const validKeys = new Set(Object.keys(schemaRow[0]));
      cleanPlaces = PLACES.map(p => {
        const cleanP: any = {};
        for (const [key, value] of Object.entries(p)) {
          if (validKeys.has(key)) {
            cleanP[key] = value;
          }
        }
        return cleanP;
      });
    } else {
      // Fallback manual strip if table is empty
      cleanPlaces = PLACES.map(p => {
        const { ...rest } = p as any;
        return rest;
      });
    }

    const { error } = await supabase
      .from('places')
      .upsert(cleanPlaces, { onConflict: 'id' });

    if (error) {
      console.error('Supabase Sync Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Also delete any places in the database that are no longer in our local PLACES array (excluding dynamic ones)
    try {
      const { data: dbPlaces } = await supabase.from('places').select('id, _dynamic');
      if (dbPlaces) {
        const localIds = new Set(PLACES.map(p => p.id));
        const staleStaticIds = dbPlaces
          .filter(p => !p._dynamic && !localIds.has(p.id))
          .map(p => p.id);
          
        if (staleStaticIds.length > 0) {
          const { error: deleteError } = await supabase
            .from('places')
            .delete()
            .in('id', staleStaticIds);
          if (deleteError) {
            console.error('Supabase Delete Stale Places Error:', deleteError);
          }
        }
      }
    } catch (e) {
      console.error('Failed to prune stale places:', e);
    }

    // Sync Stories
    const { error: storiesError } = await supabase
      .from('stories')
      .upsert(STORIES, { onConflict: 'id' });

    if (storiesError) {
      console.error('Supabase Sync Error for Stories:', storiesError);
      return NextResponse.json({ success: false, error: storiesError.message }, { status: 500 });
    }

    // Prune only stale static stories (starting with 'story-')
    try {
      const { data: dbStories } = await supabase.from('stories').select('id');
      if (dbStories) {
        const localStoryIds = new Set(STORIES.map(s => s.id));
        const staleStaticIds = dbStories
          .map(s => s.id)
          .filter(id => id.startsWith('story-') && !localStoryIds.has(id));
          
        if (staleStaticIds.length > 0) {
          const { error: deleteStoryError } = await supabase
            .from('stories')
            .delete()
            .in('id', staleStaticIds);
          if (deleteStoryError) {
            console.error('Supabase Delete Stale Stories Error:', deleteStoryError);
          }
        }
      }
    } catch (e) {
      console.error('Failed to prune stale stories:', e);
    }

    // Sync Festivals
    try {
      const { data: festivalSchemaRow } = await supabase.from('festivals').select('*').limit(1);
      let cleanFestivals: any[] = FESTIVALS_2026;
      
      if (festivalSchemaRow && festivalSchemaRow.length > 0) {
        const validKeys = new Set(Object.keys(festivalSchemaRow[0]));
        cleanFestivals = FESTIVALS_2026.map(f => {
          const cleanF: any = {};
          for (const [key, value] of Object.entries(f)) {
            if (validKeys.has(key)) {
              cleanF[key] = value;
            }
          }
          return cleanF;
        });
      }

      const { error: festivalsError } = await supabase
        .from('festivals')
        .upsert(cleanFestivals, { onConflict: 'id' });

      if (festivalsError) {
        console.error('Supabase Sync Error for Festivals:', festivalsError);
      }

      // Prune only stale static festivals (non-UUIDs)
      const { data: dbFestivals } = await supabase.from('festivals').select('id');
      if (dbFestivals) {
        const localFestivalIds = new Set(FESTIVALS_2026.map(f => f.id));
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const staleStaticIds = dbFestivals
          .map(f => f.id)
          .filter(id => !localFestivalIds.has(id) && !uuidRegex.test(id));
          
        if (staleStaticIds.length > 0) {
          const { error: deleteFestivalError } = await supabase
            .from('festivals')
            .delete()
            .in('id', staleStaticIds);
          if (deleteFestivalError) {
            console.error('Supabase Delete Stale Festivals Error:', deleteFestivalError);
          }
        }
      }
    } catch (e) {
      console.error('Failed to sync/prune festivals:', e);
    }

    return NextResponse.json({ 
      success: true, 
      count: PLACES.length, 
      storyCount: STORIES.length,
      festivalCount: FESTIVALS_2026.length
    });
  } catch (err: any) {
    console.error('Failed to sync places:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
