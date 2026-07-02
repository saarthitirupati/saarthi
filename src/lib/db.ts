import { supabase } from './supabase';
import { Place } from '@/types/place';
import { Story } from '@/types/story';
import { Quiz } from '@/types/quiz';
import { Festival } from '@/types/festival';
import { EncyclopediaArticle } from '@/types/encyclopedia';
import { UserEvent } from '@/types/event';

// --- Places (Temples) ---
export async function getPlaces(): Promise<Place[]> {
  const { data, error } = await supabase.from('places').select('*');
  if (error) throw error;
  return data as Place[];
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const { data, error } = await supabase.from('places').select('*').eq('id', id).single();
  if (error) return null;
  return data as Place;
}

// --- Stories ---
export async function getStories(): Promise<Story[]> {
  const { data, error } = await supabase.from('stories').select('*').eq('isActive', true);
  if (error) throw error;
  return data as Story[];
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const { data, error } = await supabase.from('stories').select('*').eq('slug', slug).eq('isActive', true).single();
  if (error) return null;
  return data as Story;
}

// --- Quizzes ---
export async function getQuizzes(): Promise<Quiz[]> {
  const { data, error } = await supabase.from('quizzes').select('*').eq('isActive', true);
  if (error) throw error;
  return data as Quiz[];
}

// --- Encyclopedia ---
export async function searchEncyclopedia(query: string): Promise<EncyclopediaArticle[]> {
  const { data, error } = await supabase
    .from('encyclopedia')
    .select('*')
    .eq('isActive', true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,keywords.cs.{${query}}`);
  if (error) throw error;
  return data as EncyclopediaArticle[];
}

// --- Festivals ---
export async function getUpcomingFestivals(): Promise<Festival[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('festivals')
    .select('*')
    .eq('isActive', true)
    .gte('date', today)
    .order('date', { ascending: true });
  if (error) throw error;
  return data as Festival[];
}

// --- User Events ---
export async function trackEvent(event: Omit<UserEvent, 'id' | 'createdAt'>): Promise<void> {
  const { error } = await supabase.from('user_events').insert([event]);
  if (error) console.error("Failed to track event:", error);
}
