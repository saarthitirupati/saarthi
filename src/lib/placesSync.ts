import { supabase } from '@/lib/supabase';
import { PLACES, Place } from '@/data/places';

export async function fetchLivePlaces(): Promise<Place[]> {
  try {
    const { data, error } = await supabase.from('places').select('*');
    if (!error && data) {
      const deletedIds = new Set<string>();
      data.forEach(r => {
        if (r.status === 'deleted' || r.is_deleted === true) {
          if (r.id) deletedIds.add(String(r.id).toLowerCase());
          if (r.slug) deletedIds.add(String(r.slug).toLowerCase());
        }
      });

      const activeRows = data.filter(r => r.status !== 'deleted' && !r.is_deleted);

      // Map static PLACES by ID and slug
      const staticMap = new Map<string, Place>();
      for (const p of PLACES) {
        if (p.id) staticMap.set(p.id.toLowerCase(), p);
        if ((p as any).slug) staticMap.set(String((p as any).slug).toLowerCase(), p);
      }

      const mergedMap = new Map<string, Place>();

      // 1. Add active rows from Supabase
      for (const row of activeRows) {
        const rowIdStr = row.id ? String(row.id).toLowerCase() : '';
        const rowSlugStr = row.slug ? String(row.slug).toLowerCase() : '';

        const base = staticMap.get(rowSlugStr) || staticMap.get(rowIdStr);

        const cleaned: Record<string, any> = {};
        for (const [k, v] of Object.entries(row)) {
          if (v !== null && v !== undefined && v !== '') cleaned[k] = v;
        }

        // Canonical readable ID preference: base.id > row.slug > row.id
        const canonicalId = base?.id || row.slug || row.id;

        const item = {
          ...(base || {}),
          ...cleaned,
          id: canonicalId,
          slug: row.slug || base?.id || canonicalId,
          db_id: row.id,
          uuid: row.id
        } as Place;

        if (base?.image?.startsWith('http')) {
          item.image = base.image;
        } else if (row.hero_image?.startsWith('http')) {
          item.image = row.hero_image;
        } else {
          item.image = base?.image || row.hero_image || item.image;
        }
        (item as any).hero_image = item.image;

        const key = canonicalId.toLowerCase();
        mergedMap.set(key, item);
        if (rowIdStr) mergedMap.set(rowIdStr, item);
      }

      // 2. Add static places ONLY if they have NOT been marked deleted
      for (const sp of PLACES) {
        const spId = sp.id.toLowerCase();
        if (!deletedIds.has(spId) && !mergedMap.has(spId)) {
          mergedMap.set(spId, sp);
        }
      }

      const FORBIDDEN_SLUGS = new Set([
        'tumburu-theertham',
        'mamandur-village',
        'tuda-park',
        'museum-alipiri',
        'veda-pathasala',
        'tarigonda-vengamamba-annaprasadam',
        'karvetinagaram-temple',
        'mogili-temple'
      ]);

      return Array.from(new Set(mergedMap.values())).filter(
        p => (p as any).status !== 'deleted' && 
             !(p as any).is_deleted && 
             !FORBIDDEN_SLUGS.has((p.id || '').toLowerCase()) && 
             !FORBIDDEN_SLUGS.has(((p as any).slug || '').toLowerCase())
      );
    }
  } catch (err) {
    console.error('Failed to fetch live places:', err);
  }

  const FORBIDDEN_SLUGS = new Set([
    'tumburu-theertham',
    'mamandur-village',
    'tuda-park',
    'museum-alipiri',
    'veda-pathasala',
    'tarigonda-vengamamba-annaprasadam',
    'karvetinagaram-temple',
    'mogili-temple'
  ]);
  return PLACES.filter(p => !FORBIDDEN_SLUGS.has(p.id.toLowerCase()));
}
