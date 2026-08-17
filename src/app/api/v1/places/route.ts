import { NextResponse } from 'next/server';
import { getPlaces, getPlacesByCategory } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { ApiResponse } from '@/types/api';
import { Place } from '@/types/place';
import { PLACES } from '@/data/places';

import { getApiBaseUrl } from '@/lib/api';

const BACKEND_URL = getApiBaseUrl();

const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function withVerifiedCoords(places: Place[]): Place[] {
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Construct backend query URL
    const url = new URL(`${BACKEND_URL}/api/v1/places`);
    if (category) url.searchParams.append('category', category);
    
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return NextResponse.json({
          success: true,
          data: withVerifiedCoords(json.data)
        });
      }
    }
    
    throw new Error('Backend failed');
  } catch (error: any) {
    console.warn('FastAPI backend failed, falling back to database/static:', error.message || error);
    try {
      const { searchParams } = new URL(request.url);
      const city = searchParams.get('city') || 'tirupati';
      const category = searchParams.get('category');
      
      let places: Place[];
      if (category) {
        places = await getPlacesByCategory(category) as Place[];
      } else {
        places = await getPlaces(city) as Place[];
      }
      
      const data = withVerifiedCoords(places);
      // Also fetch deleted slugs so client can exclude them from static fallback
      const { data: deletedRows } = await supabase
        .from('places')
        .select('slug, id')
        .eq('status', 'deleted');
      const deletedSlugs = (deletedRows || []).flatMap((r: any) => [r.slug, r.id].filter(Boolean));
      return NextResponse.json({
        success: true,
        data,
        deletedSlugs,
      });
    } catch (fallbackError: any) {
      console.warn('Database fallback failed, returning static PLACES:', fallbackError?.message || fallbackError);
      return NextResponse.json({
        success: true,
        data: withVerifiedCoords(PLACES),
        deletedSlugs: [],
      });
    }
  }
}
