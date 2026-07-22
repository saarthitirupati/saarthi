import { supabase } from '@/lib/supabase';
import { PLACES, Place } from '@/data/places';

export async function fetchLivePlaces(): Promise<Place[]> {
  try {
    const { data, error } = await supabase.from('places').select('*');
    if (!error && data) {
      const deletedIds = new Set(
        data.filter(r => r.status === 'deleted' || r.is_deleted === true).map(r => r.id)
      );
      const activeRows = data.filter(r => r.status !== 'deleted' && !r.is_deleted);

      const staticMap = new Map(PLACES.map(p => [p.id, p]));
      const mergedMap = new Map<string, Place>();

      // 1. Add active rows from Supabase
      for (const row of activeRows) {
        const base = staticMap.get(row.id);
        const cleaned: Record<string, any> = {};
        for (const [k, v] of Object.entries(row)) {
          if (v !== null && v !== undefined && v !== '') cleaned[k] = v;
        }
        const item = { ...(base || {}), ...cleaned } as Place;
        mergedMap.set(item.id, item);
      }

      // 2. Add static places ONLY if they have NOT been marked deleted
      for (const sp of PLACES) {
        if (!deletedIds.has(sp.id) && !mergedMap.has(sp.id)) {
          mergedMap.set(sp.id, sp);
        }
      }

      return Array.from(mergedMap.values()).filter(
        p => (p as any).status !== 'deleted' && !(p as any).is_deleted
      );
    }
  } catch (err) {
    console.error('Failed to fetch live places:', err);
  }

  return PLACES;
}
