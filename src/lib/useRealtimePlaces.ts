'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Place } from '@/data/places';

const toSafeStr = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    if (Array.isArray(val)) return toSafeStr(val[0]);
    return val.name || val.slug || val.title || val.address || '';
  }
  return String(val);
};

const dedupePlaces = (list: Place[]): Place[] => {
  const seen = new Set<string>();
  return list.filter(p => {
    const nameKey = (p.name || '').toLowerCase().trim();
    const idKey = (p.id || (p as any).slug || '').toLowerCase().trim();
    if (nameKey && seen.has(nameKey)) return false;
    if (idKey && seen.has(idKey)) return false;
    if (nameKey) seen.add(nameKey);
    if (idKey) seen.add(idKey);
    return true;
  });
};

import { safeFetchJson } from './safeFetch';

export function useRealtimePlaces(initialPlaces: Place[] = []) {
  const [places, setPlaces] = useState<Place[]>(
    dedupePlaces(initialPlaces).filter(p => p.placeType !== 'food' && p.category !== 'Food')
  );
  const [loading, setLoading] = useState(!initialPlaces.length);

  useEffect(() => {
    // 1. Fetch initial data
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const apiRes = await safeFetchJson<any>('/api/v1/places');
        if (apiRes && apiRes.data) {
          const data = apiRes.data;
          if (data && data.length > 0) {
            // Merge: static data as base, Supabase overrides only defined fields
            const staticMap = new Map(initialPlaces.map(p => [p.id, p]));
            const merged: Place[] = data.map((row: any) => {
              const base = staticMap.get(row.id);
              const cleaned: Record<string, any> = {};
              for (const [k, v] of Object.entries(row)) {
                if (v !== null && v !== undefined && v !== '') cleaned[k] = v;
              }
              const result = { ...(base || {}), ...cleaned } as Place;
              if (base?.coordinates) result.coordinates = base.coordinates;
              result.category = toSafeStr(result.category);
              result.location = toSafeStr(result.location);
              result.placeType = toSafeStr(result.placeType) as any;
              result.tags = Array.isArray(result.tags) ? result.tags : [];
              result.interests = Array.isArray(result.interests) ? result.interests : [];
              result.image = result.image || (result as any).hero_image || (base as any)?.image || '/assets/ai/hero_spiritual_sunset.png';
              return result;
            });
            // Add any static places not in Supabase
            for (const sp of initialPlaces) {
              const spName = (sp.name || '').toLowerCase().trim();
              if (!data.some((d: any) => d.id === sp.id || (d.name || '').toLowerCase().trim() === spName)) {
                merged.push(sp);
              }
            }
            // Filter out food places and deduplicate
            const finalPlaces = dedupePlaces(merged).filter(p => p.placeType !== 'food' && p.category !== 'Food');
            setPlaces(finalPlaces);
          }
        }
      } catch (e) {
        console.error("Failed to fetch places, using static config", e);
      }
      setLoading(false);
    };

    fetchPlaces();

    // 2. Subscribe to realtime changes
    const subscription = supabase
      .channel('public:places')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'places' },
        (payload) => {
          const staticMap = new Map(initialPlaces.map(p => [p.id, p]));
          const cleanAndMerge = (row: any) => {
            const base = staticMap.get(row.id);
            const cleaned: Record<string, any> = {};
            for (const [k, v] of Object.entries(row)) {
              if (v !== null && v !== undefined && v !== '') cleaned[k] = v;
            }
            const result = { ...(base || {}), ...cleaned } as Place;
            result.category = toSafeStr(result.category);
            result.location = toSafeStr(result.location);
            result.placeType = toSafeStr(result.placeType) as any;
            result.tags = Array.isArray(result.tags) ? result.tags : [];
            result.interests = Array.isArray(result.interests) ? result.interests : [];
            result.image = result.image || (result as any).hero_image || (base as any)?.image || '/assets/ai/hero_spiritual_sunset.png';
            return result;
          };

          if (payload.eventType === 'INSERT') {
            const cleanedNew = cleanAndMerge(payload.new);
            if (cleanedNew.placeType !== 'food' && cleanedNew.category !== 'Food') {
              setPlaces((prev) => [...prev, cleanedNew]);
            }
          } else if (payload.eventType === 'UPDATE') {
            setPlaces((prev) =>
              prev
                .map((place) => (place.id === payload.new.id ? cleanAndMerge(payload.new) : place))
                .filter((p) => p.placeType !== 'food' && p.category !== 'Food')
            );
          } else if (payload.eventType === 'DELETE') {
            setPlaces((prev) => prev.filter((place) => place.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { places, loading };
}
