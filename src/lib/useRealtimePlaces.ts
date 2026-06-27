'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Place } from '@/data/places';

export function useRealtimePlaces(initialPlaces: Place[] = []) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [loading, setLoading] = useState(!initialPlaces.length);

  useEffect(() => {
    // 1. Fetch initial data
    const fetchPlaces = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('places').select('*');
      if (!error && data) {
        setPlaces(data as Place[]);
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
          if (payload.eventType === 'INSERT') {
            setPlaces((prev) => [...prev, payload.new as Place]);
          } else if (payload.eventType === 'UPDATE') {
            setPlaces((prev) =>
              prev.map((place) => (place.id === payload.new.id ? (payload.new as Place) : place))
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
