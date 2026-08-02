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
          const apiDeletedSlugs: string[] = apiRes.deletedSlugs || [];
          const FORBIDDEN_SLUGS = new Set(['tumburu-theertham', 'mamandur-village', 'tuda-park', 'museum-alipiri', 'veda-pathasala', 'tarigonda-vengamamba-annaprasadam', 'karvetinagaram-temple']);
          // All slugs/ids that should never appear — hard-deleted or forbidden
          const excludedSlugs = new Set([
            ...apiDeletedSlugs.map(s => s.toLowerCase()),
            ...Array.from(FORBIDDEN_SLUGS),
          ]);
          const deletedIds = new Set(
            data.filter((r: any) => r.status === 'deleted' || r.is_deleted === true).map((r: any) => r.id)
          );
          const activeData = data.filter((r: any) => 
            r.status !== 'deleted' && 
            !r.is_deleted && 
            !excludedSlugs.has((r.id || '').toLowerCase()) && 
            !excludedSlugs.has((r.slug || '').toLowerCase())
          );

          // Merge: static verified data as base, Supabase overrides text status fields only
          const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

          const merged: Place[] = activeData.map((row: any) => {
            const rowName = (row.name || '').toLowerCase().trim();
            const rowSlug = (row.slug || '').toLowerCase().trim();
            const normRowName = normalize(row.name);
            const normRowSlug = normalize(row.slug);

            const base = initialPlaces.find(p => {
              if (p.id === row.id || p.id === rowSlug) return true;
              const pName = (p.name || '').toLowerCase().trim();
              if (pName === rowName) return true;
              const normPName = normalize(p.name);
              const normPId = normalize(p.id);
              if (normPName && normPName === normRowName) return true;
              if (normPId && (normPId === normRowSlug || normPId === normRowName)) return true;
              return false;
            });
            const cleaned: Record<string, any> = {};
            for (const [k, v] of Object.entries(row)) {
              if (v !== null && v !== undefined && v !== '') cleaned[k] = v;
            }
            const result = { ...(base || {}), ...cleaned } as Place;
            // Always preserve canonical static ID (slug) so URLs remain stable (/place/kodandarama-temple)
            if (base) {
              result.id = base.id;
              (result as any).db_id = row.id;
            }
            // Always prioritize authoritative verified GPS coordinates from static places data
            if (base && base.coordinates && base.coordinates.lat && base.coordinates.lng) {
              result.coordinates = base.coordinates;
            }
            if (base && base.history && base.history.length > (row.history || '').length) {
              result.history = base.history;
            }
            result.category = toSafeStr(result.category);
            result.location = toSafeStr(result.location);
            result.placeType = toSafeStr(result.placeType) as any;
            result.tags = Array.isArray(result.tags) ? result.tags : [];
            result.interests = Array.isArray(result.interests) ? result.interests : [];
            if (base?.image?.startsWith('http')) {
              result.image = base.image;
            } else if (row.hero_image?.startsWith('http')) {
              result.image = row.hero_image;
            } else if (row.image?.startsWith('http')) {
              result.image = row.image;
            } else {
              result.image = base?.image || row.hero_image || result.image || 'https://images.unsplash.com/photo-1514222134-b57cbf8ce673?auto=format&fit=crop&q=80&w=800';
            }
            if (base?.images && base.images.length > 0 && base.images[0]?.startsWith('http')) {
              result.images = base.images;
            }
            return result;
          });
          // Add static places not in Supabase AND not in the excluded/deleted set
          for (const sp of initialPlaces) {
            const normSpName = normalize(sp.name);
            const normSpId = normalize(sp.id);
            const isExcluded = excludedSlugs.has(sp.id.toLowerCase()) || excludedSlugs.has(normSpId);
            if (
              !isExcluded &&
              !deletedIds.has(sp.id) &&
              !activeData.some((d: any) => d.id === sp.id || normalize(d.name) === normSpName || normalize(d.slug) === normSpId)
            ) {
              merged.push(sp);
            }
          }
          // Filter out food & deleted places and deduplicate
          const finalPlaces = dedupePlaces(merged).filter(p => p.placeType !== 'food' && p.category !== 'Food' && (p as any).status !== 'deleted');
          setPlaces(finalPlaces);
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
            if (base?.image?.startsWith('http')) {
              result.image = base.image;
            } else if (row.hero_image?.startsWith('http')) {
              result.image = row.hero_image;
            } else if (row.image?.startsWith('http')) {
              result.image = row.image;
            } else {
              result.image = base?.image || row.hero_image || result.image || 'https://images.unsplash.com/photo-1514222134-b57cbf8ce673?auto=format&fit=crop&q=80&w=800';
            }
            if (base?.images && base.images.length > 0 && base.images[0]?.startsWith('http')) {
              result.images = base.images;
            }
            // Always prioritize authoritative verified GPS coordinates from static places data
            if (base?.coordinates?.lat && base?.coordinates?.lng) {
              result.coordinates = base.coordinates;
            }
            if (base && base.history && base.history.length > (row.history || '').length) {
              result.history = base.history;
            }
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
