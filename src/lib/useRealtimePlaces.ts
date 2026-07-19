'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Place } from '@/data/places';

export function useRealtimePlaces(initialPlaces: Place[] = []) {
  const [places, setPlaces] = useState<Place[]>(
    initialPlaces.filter(p => p.placeType !== 'food' && p.category !== 'Food')
  );
  const [loading, setLoading] = useState(!initialPlaces.length);

  useEffect(() => {
    // 1. Fetch initial data
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/places');
        if (res.ok) {
          const apiRes = await res.json();
          const data = apiRes.data;
          if (data && data.length > 0) {
            // Merge: static data as base, Supabase overrides only defined fields
            const staticMap = new Map(initialPlaces.map(p => [p.id, p]));
            const merged: Place[] = data.map((row: any) => {
              const base = staticMap.get(row.id);
              if (!base) return row as Place;
              // Strip null/undefined Supabase values so static fields survive
              const cleaned: Record<string, any> = {};
              for (const [k, v] of Object.entries(row)) {
                if (v !== null && v !== undefined && v !== '') cleaned[k] = v;
              }
              const result = { ...base, ...cleaned } as Place;
              // Preserve verified static coordinates over potentially stale DB values
              if (base.coordinates) result.coordinates = base.coordinates;
              return result;
            });
            // Add any static places not in Supabase
            for (const sp of initialPlaces) {
              if (!data.some((d: any) => d.id === sp.id)) merged.push(sp);
            }
            // Filter out food places
            setPlaces(merged.filter(p => p.placeType !== 'food' && p.category !== 'Food'));
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
            if (!base) return row as Place;
            const cleaned: Record<string, any> = {};
            for (const [k, v] of Object.entries(row)) {
              if (v !== null && v !== undefined && v !== '') cleaned[k] = v;
            }
            return { ...base, ...cleaned } as Place;
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
