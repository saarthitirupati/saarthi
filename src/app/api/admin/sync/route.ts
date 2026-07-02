import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PLACES } from '@/data/places';
import { STORIES } from '@/data/stories';

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

    // Also delete any places in the database that are no longer in our local PLACES array
    const localIds = PLACES.map(p => p.id);
    if (localIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('places')
        .delete()
        .not('id', 'in', `(${localIds.join(',')})`);
      if (deleteError) {
        console.error('Supabase Delete Stale Places Error:', deleteError);
      }
    }

    // Sync Stories
    const { error: storiesError } = await supabase
      .from('stories')
      .upsert(STORIES, { onConflict: 'id' });

    if (storiesError) {
      console.error('Supabase Sync Error for Stories:', storiesError);
      return NextResponse.json({ success: false, error: storiesError.message }, { status: 500 });
    }

    const localStoryIds = STORIES.map(s => s.id);
    if (localStoryIds.length > 0) {
      const { error: deleteStoryError } = await supabase
        .from('stories')
        .delete()
        .not('id', 'in', `(${localStoryIds.join(',')})`);
      if (deleteStoryError) {
        console.error('Supabase Delete Stale Stories Error:', deleteStoryError);
      }
    }

    return NextResponse.json({ success: true, count: PLACES.length, storyCount: STORIES.length });
  } catch (err: any) {
    console.error('Failed to sync places:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
