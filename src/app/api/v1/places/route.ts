import { NextResponse } from 'next/server';
import { getPlaces, getPlacesByCategory } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { Place } from '@/types/place';
import { PLACES } from '@/data/places';
import { getApiBaseUrl } from '@/lib/api';

const BACKEND_URL = getApiBaseUrl();

const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Pre-compute static coordinates map once on startup
const staticCoordMap = new Map<string, { lat: number; lng: number }>();
for (const p of PLACES) {
  if (p.coordinates) {
    if (p.id) {
      staticCoordMap.set(p.id.toLowerCase(), p.coordinates);
      staticCoordMap.set(normalize(p.id), p.coordinates);
    }
    if (p.name) {
      staticCoordMap.set(p.name.toLowerCase().trim(), p.coordinates);
      staticCoordMap.set(normalize(p.name), p.coordinates);
    }
    const pSlug = (p as any).slug;
    if (pSlug) {
      staticCoordMap.set(pSlug.toLowerCase(), p.coordinates);
      staticCoordMap.set(normalize(pSlug), p.coordinates);
    }
  }
}

function withVerifiedCoords(places: Place[]): Place[] {
  return places.map(p => {
    const pSlug = (p as any).slug;
    const byId = p.id ? (staticCoordMap.get(p.id.toLowerCase()) || staticCoordMap.get(normalize(p.id))) : undefined;
    const byName = p.name ? (staticCoordMap.get(p.name.toLowerCase().trim()) || staticCoordMap.get(normalize(p.name))) : undefined;
    const bySlug = pSlug ? (staticCoordMap.get(pSlug.toLowerCase()) || staticCoordMap.get(normalize(pSlug))) : undefined;

    const verified = byId || byName || bySlug;
    if (verified) return { ...p, coordinates: verified };
    return p;
  });
}

// In-memory route-level cache (60s TTL)
interface CacheEntry {
  data: Place[];
  deletedSlugs: string[];
  expiresAt: number;
}
const placesCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000;

// Pre-seed default in-memory cache with verified static places for instantaneous initial response (0ms cold start)
const defaultPlaces = withVerifiedCoords(PLACES);
placesCache.set('tirupati:', {
  data: defaultPlaces,
  deletedSlugs: [],
  expiresAt: Date.now() + 10 * 1000 // Revalidate in background after 10s
});

async function revalidatePlacesCache(city: string, category: string, cacheKey: string) {
  try {
    if (BACKEND_URL) {
      try {
        const url = new URL(`${BACKEND_URL}/api/v1/places`);
        if (category) url.searchParams.append('category', category);
        const res = await fetch(url.toString(), { signal: AbortSignal.timeout(2000), next: { revalidate: 60 } });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const data = withVerifiedCoords(json.data);
            const deletedSlugs = json.deletedSlugs || [];
            placesCache.set(cacheKey, { data, deletedSlugs, expiresAt: Date.now() + CACHE_TTL_MS });
            return;
          }
        }
      } catch {}
    }

    let places: Place[];
    if (category) {
      places = (await getPlacesByCategory(category)) as Place[];
    } else {
      places = (await getPlaces(city)) as Place[];
    }

    const data = withVerifiedCoords(places);
    const { data: deletedRows } = await supabase
      .from('places')
      .select('slug, id')
      .eq('status', 'deleted');

    const deletedSlugs = (deletedRows || []).flatMap((r: any) => [r.slug, r.id].filter(Boolean));
    placesCache.set(cacheKey, { data, deletedSlugs, expiresAt: Date.now() + CACHE_TTL_MS });
  } catch (err: any) {
    console.warn('Background places revalidation failed:', err?.message || err);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'tirupati';
  const category = searchParams.get('category') || '';
  const cacheKey = `${city}:${category}`;

  // 1. Check in-memory cache first (return immediately if available, or if revalidation in progress)
  const cached = placesCache.get(cacheKey);
  if (cached) {
    // If cache is fresh, return immediately
    if (Date.now() < cached.expiresAt) {
      return NextResponse.json(
        { success: true, data: cached.data, deletedSlugs: cached.deletedSlugs },
        {
          headers: {
            'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
            'X-Cache': 'HIT',
          },
        }
      );
    }
    // If stale, trigger non-blocking background revalidation and still return stale data to eliminate user wait time
    revalidatePlacesCache(city, category, cacheKey).catch(() => {});
    return NextResponse.json(
      { success: true, data: cached.data, deletedSlugs: cached.deletedSlugs },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
          'X-Cache': 'STALE-REVALIDATING',
        },
      }
    );
  }

  // 2. Synchronous first-time populate if specific category is not in cache yet
  try {
    await revalidatePlacesCache(city, category, cacheKey);
    const updated = placesCache.get(cacheKey);
    if (updated) {
      return NextResponse.json(
        { success: true, data: updated.data, deletedSlugs: updated.deletedSlugs },
        {
          headers: {
            'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
            'X-Cache': 'MISS-RESOLVED',
          },
        }
      );
    }
  } catch {}

  // Fallback to static PLACES dataset
  const filteredPlaces = category
    ? PLACES.filter(p => p.category?.toLowerCase() === category.toLowerCase())
    : PLACES;
  const data = withVerifiedCoords(filteredPlaces);
  placesCache.set(cacheKey, { data, deletedSlugs: [], expiresAt: Date.now() + CACHE_TTL_MS });

  return NextResponse.json({
    success: true,
    data,
    deletedSlugs: [],
  });
}
