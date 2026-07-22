import { supabase } from '@/lib/supabase';

export function formatPlaceRow(row: any) {
  if (!row) return row;
  let categoryStr = row.category;
  if (typeof row.category === 'object' && row.category !== null) {
    categoryStr = Array.isArray(row.category)
      ? (row.category[0]?.name || row.category[0]?.slug || '')
      : (row.category.name || row.category.slug || '');
  }
  let locationStr = row.location;
  if (typeof row.location === 'object' && row.location !== null) {
    locationStr = Array.isArray(row.location)
      ? (row.location[0]?.name || '')
      : (row.location.name || row.location.address || '');
  }
  let placeTypeStr = row.placeType;
  if (typeof row.placeType === 'object' && row.placeType !== null) {
    placeTypeStr = Array.isArray(row.placeType)
      ? (row.placeType[0]?.name || '')
      : (row.placeType.name || row.placeType.slug || '');
  }
  return {
    ...row,
    category: typeof categoryStr === 'string' ? categoryStr : String(categoryStr || ''),
    location: typeof locationStr === 'string' ? locationStr : String(locationStr || ''),
    placeType: typeof placeTypeStr === 'string' ? placeTypeStr : String(placeTypeStr || ''),
  };
}

// Places
export async function getPlaces(citySlug: string = 'tirupati') {
  const { data: city } = await supabase.from('cities').select('id').eq('slug', citySlug).single();
  if (!city) return [];
  const { data, error } = await supabase.from('places').select('*, category:categories(name, slug, icon)').eq('city_id', city.id).eq('status', 'Published').order('priority', { ascending: false });
  if (error) throw error;
  return (data || []).map(formatPlaceRow);
}

export async function getPlaceBySlug(slug: string) {
  const { data: place, error } = await supabase.from('places').select('*, category:categories(name, slug, icon)').eq('slug', slug).single();
  if (error || !place) return null;
  
  const { data: nearby } = await supabase.from('place_nearby')
    .select('nearby_place:nearby_place_id(*)')
    .eq('place_id', place.id)
    .order('priority', { ascending: true });
    
  return formatPlaceRow({ ...place, nearby_places: (nearby?.map(n => n.nearby_place) || []).map(formatPlaceRow) });
}

export async function getPlacesByCategory(categorySlug: string) {
  const { data: category } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
  if (!category) return [];
  const { data, error } = await supabase.from('places').select('*, category:categories(name, slug, icon)').eq('category_id', category.id).eq('status', 'Published').order('priority', { ascending: false });
  if (error) throw error;
  return (data || []).map(formatPlaceRow);
}

// Categories
export async function getCategories(citySlug: string = 'tirupati') {
  const { data: city } = await supabase.from('cities').select('id').eq('slug', citySlug).single();
  if (!city) return [];
  const { data, error } = await supabase.from('categories').select('*').eq('city_id', city.id).order('priority', { ascending: true });
  if (error) throw error;
  return data;
}

// Live
export async function getLiveUpdates(citySlug: string = 'tirupati') {
  const { data: city } = await supabase.from('cities').select('id').eq('slug', citySlug).single();
  if (!city) return [];
  const { data, error } = await supabase.from('live_updates').select('*').eq('city_id', city.id).eq('is_active', true).order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getDarshanTypes(citySlug: string = 'tirupati') {
  const { data: city } = await supabase.from('cities').select('id').eq('slug', citySlug).single();
  if (!city) return [];
  const { data, error } = await supabase.from('darshan_types').select('*').eq('city_id', city.id).order('priority', { ascending: true });
  if (error) throw error;
  return data;
}

// Festivals
export async function getFestivals(citySlug: string = 'tirupati', all: boolean = false) {
  const { data: city } = await supabase.from('cities').select('id').eq('slug', citySlug).single();
  if (!city) return [];
  let query = supabase.from('festivals').select('*').eq('city_id', city.id).eq('is_active', true);
  if (!all) {
    const today = new Date().toISOString().split('T')[0];
    query = query.gte('date_start', today);
  }
  const { data, error } = await query.order('date_start', { ascending: true });
  if (error) throw error;
  return data;
}
// Alerts
export async function getAlerts(citySlug: string = 'tirupati') {
  const { data: city } = await supabase.from('cities').select('id').eq('slug', citySlug).single();
  if (!city) return [];
  const { data, error } = await supabase.from('alerts').select('*').eq('city_id', city.id).eq('is_active', true).or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Feedback
export async function submitFeedback(placeId: string, isPositive: boolean, comment?: string) {
  const { error } = await supabase.from('feedback').insert([{ place_id: placeId, is_positive: isPositive, comment }]);
  if (error) throw error;
}

// Analytics
export async function logEvent(action: string, placeId?: string, metadata?: any) {
  const { error } = await supabase.from('analytics_events').insert([{ action, place_id: placeId, metadata }]);
  if (error) console.error("Failed to log event:", error);
}
