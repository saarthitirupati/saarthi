'use client';

import { PLACES, Place } from '@/data/places';
import { Search, Star, Filter, ArrowLeft, BookOpen, GraduationCap, MapPin, Sparkles, AlertTriangle, Compass, Bell } from 'lucide-react';
import { useState, useMemo, Suspense, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import styles from './Explore.module.css';
import { calculateDrivingDistance, TIRUPATI_CENTER, isWithinTirupatiRegion, formatTravelTime, estimateDriveDuration } from '@/utils/location';
import { useTrip } from '@/components/TripContext';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { useLanguage } from '@/lib/useLanguage';
import { LocationPickerModal, LocationPill } from '@/components/common/LocationPickerModal';

const FILTERS_DATA = [
  { key: 'All', labelEn: 'All', labelTe: 'అన్నీ' },
  { key: 'Nearby', labelEn: 'Nearby', labelTe: 'సమీపంలో' },
  { key: 'Spiritual', labelEn: 'Spiritual', labelTe: 'ఆధ్యాత్మికం' },
  { key: 'Nature', labelEn: 'Nature', labelTe: 'ప్రకృతి' },
  { key: 'Water', labelEn: 'Theerthams', labelTe: 'తీర్థాలు' },
  { key: 'Historical', labelEn: 'Heritage', labelTe: 'చారిత్రకం' },
  { key: 'Hidden', labelEn: 'Hidden Gems', labelTe: 'దాగి ఉన్నవి' },
  { key: 'Culture', labelEn: 'Culture', labelTe: 'సంస్కృతి' }
];

function ExploreContent() {
  const lang = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialFilter = searchParams.get('category') || searchParams.get('filter') || '';
  
  const filters = FILTERS_DATA.map(f => f.key);
  const { places, loading: _loading } = useRealtimePlaces(PLACES);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('All');
  const [locationError, setLocationError] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { userLocation, setUserLocation, setLocationPermission, locationName } = useTrip();

  // Cross-collection search results from Supabase
  const [crossResults, setCrossResults] = useState<{ stories: any[]; encyclopedia: any[] }>({ stories: [], encyclopedia: [] });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
    if (initialFilter) {
      const match = filters.find(f => f.toLowerCase() === initialFilter.toLowerCase());
      if (match) setActiveFilter(match);
    }
  }, [initialQuery, initialFilter]);

  // Debounced cross-collection search
  const fetchCrossResults = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setCrossResults({ stories: [], encyclopedia: [] });
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setCrossResults({ stories: data.stories || [], encyclopedia: data.encyclopedia || [] });
        }
      } catch { /* silently fail */ }
    }, 300);
  }, []);

  useEffect(() => {
    fetchCrossResults(searchQuery);
  }, [searchQuery, fetchCrossResults]);

  const handleFilterClick = (filter: string) => {
    if (filter === 'Nearby') {
      if (!userLocation) {
        import('@/lib/location').then(({ detectCoordinates, TIRUPATI_CENTER }) => {
          detectCoordinates(
            (coords) => {
              setUserLocation(coords);
              setLocationPermission('granted');
              setActiveFilter('Nearby');
              setLocationError(false);
            },
            () => {
              setLocationError(true);
              setUserLocation(TIRUPATI_CENTER);
              setLocationPermission('denied');
              setActiveFilter('Nearby');
            }
          );
        }).catch(() => {});
      } else {
        setActiveFilter('Nearby');
      }
    } else {
      setActiveFilter(filter);
    }
  };

  const isAlternativeQuery = searchQuery.toLowerCase().includes('alternative');
  const isTirupatiQuery = searchQuery.toLowerCase() === 'tirupati' || searchQuery.toLowerCase() === 'nearby';

  const filteredPlaces = useMemo(() => {
    const rawSource = places.length > 0 ? places : PLACES;
    const seenKeys = new Set<string>();
    const source = rawSource.filter(p => {
      const nameKey = (p.name || '').toLowerCase().trim();
      const idKey = (p.id || (p as any).slug || '').toLowerCase().trim();
      if (nameKey && seenKeys.has(nameKey)) return false;
      if (idKey && seenKeys.has(idKey)) return false;
      if (nameKey) seenKeys.add(nameKey);
      if (idKey) seenKeys.add(idKey);
      return true;
    });
    let result = source.filter((place: Place) => {
      if (isAlternativeQuery) {
        // Exclude the main Srivari Venkateswara temple
        if (place.id === 'venkateswara') return false;
        
        // Prioritize alternative spiritual temples, nature sights, and hidden gems
        return place.placeType === 'spiritual' || place.placeType === 'nature' || place.placeType === 'historical' || place.isHiddenGem || place.isMustVisit;
      }

      if (isTirupatiQuery) {
        // Exclude all Tirumala hilltop spots
        const locationLower = (place.location || '').toLowerCase();
        const isTirumala = locationLower.includes('tirumala') || 
                           place.id === 'venkateswara' || 
                           place.id === 'silathoranam' || 
                           place.id === 'japali-hanuman' || 
                           place.id === 'swami-pushkarini' || 
                           place.id === 'papavinasam' || 
                           place.id === 'akasaganga' || 
                           place.id === 'chakra-theertham' || 
                           place.id === 'bhu-varaha';
        return !isTirumala;
      }

      const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const q = searchQuery.trim().toLowerCase();
      const qNorm = normalize(q);
      const qTokens = q.split(/\s+/).filter(Boolean);

      // Build comprehensive searchable place text
      const placeBlob = [
        place.name,
        place.id,
        place.location,
        place.address,
        place.category,
        place.placeType,
        place.description,
        place.shortIntro,
        place.spiritualInfo?.god,
        place.spiritualInfo?.knownFor,
        place.spiritualInfo?.mantra,
        ...(place.tags || []),
        ...(place.interests || []),
        ...((place as any).searchIntelligence?.aliases || []),
        ...((place as any).searchIntelligence?.intentQueries || []),
        ...((place as any).searchIntelligence?.misspellings || [])
      ].filter(Boolean).map(v => String(v).toLowerCase()).join(' ');

      const placeBlobNorm = normalize(placeBlob);

      // 1. Direct substring match or normalized space-insensitive match (e.g. "Govinda Raja" <-> "Govindaraja")
      const directMatch = placeBlob.includes(q) || placeBlobNorm.includes(qNorm);

      // 2. Tokenized word matching (handles multi-word queries)
      const STOP_WORDS = new Set(['sri', 'shri', 'vari', 'temple', 'the', 'and', 'in', 'at', 'of']);
      const significantTokens = qTokens.filter(t => !STOP_WORDS.has(t) && t.length > 1);
      const tokensMatch = significantTokens.length > 0
        ? significantTokens.every(token => placeBlob.includes(token) || placeBlobNorm.includes(normalize(token)))
        : qTokens.every(token => placeBlob.includes(token));

      // 3. Pilgrim intent alias matching
      let aliasMatch = false;
      if (q.includes('hanuman') || q.includes('anjaneya')) {
        aliasMatch = placeBlob.includes('japali') || placeBlob.includes('anjaneya') || placeBlob.includes('hanuman');
      } else if (q.includes('waterfall') || q.includes('falls')) {
        aliasMatch = placeBlob.includes('talakona') || placeBlob.includes('nagala') || placeBlob.includes('kailasa') || placeBlob.includes('tada') || placeBlob.includes('kapila');
      } else if (q.includes('govinda') || q.includes('govindaraja')) {
        aliasMatch = placeBlobNorm.includes('govindaraja');
      } else if (q.includes('jain') || q.includes('parshwanath')) {
        aliasMatch = placeBlob.includes('jain') || placeBlob.includes('parshwanath');
      }

      const toStr = (v: any) => typeof v === 'string' ? v : (v?.name || v?.slug || String(v || ''));
      const matchesSearch = !q || directMatch || tokensMatch || aliasMatch;
        
      // Multi-attribute Filter Matching logic
      const f = activeFilter.toLowerCase();
      let matchesFilter = false;
      if (f === 'all' || f === 'nearby') {
        matchesFilter = true;
      } else {
        const pType = toStr(place.placeType).toLowerCase();
        const pCat = toStr(place.category).toLowerCase();
        const pTags = (place.tags || []).map(t => toStr(t).toLowerCase());
        const pInterests = (place.interests || []).map(i => toStr(i).toLowerCase());

        const directTypeMatch = pType === f;
        const directCatMatch = pCat.includes(f);
        const directTagMatch = pTags.some(t => t.includes(f));
        const directInterestMatch = pInterests.some(i => i.includes(f));

        if (f === 'temple' || f === 'temples' || f === 'spiritual') {
          matchesFilter = directTypeMatch || directCatMatch || directTagMatch || directInterestMatch || pType === 'spiritual' || pCat.includes('temple') || pCat.includes('spiritual');
        } else if (f === 'culture') {
          matchesFilter = directTypeMatch || directCatMatch || directTagMatch || directInterestMatch || pCat.includes('culture') || pCat.includes('museum') || pCat.includes('science') || pTags.some(t => t.includes('museum') || t.includes('culture') || t.includes('science'));
        } else if (f === 'water' || f === 'theerthams') {
          matchesFilter = pCat.includes('waterfall') || pCat.includes('theertham') || pTags.some(t => t.includes('water') || t.includes('theertham') || t.includes('waterfall') || t.includes('pushkarini'));
        } else if (f === 'nature') {
          matchesFilter = pType === 'nature' || pCat.includes('nature') || pCat.includes('park') || pCat.includes('forest') || pTags.some(t => t.includes('nature') || t.includes('viewpoint') || t.includes('hills') || t.includes('falls') || t.includes('waterfall') || t.includes('dam'));
        } else if (f === 'historical' || f === 'history' || f === 'heritage') {
          matchesFilter = pType === 'historical' || pCat.includes('history') || pCat.includes('heritage') || pCat.includes('fort') || pTags.some(t => t.includes('history') || t.includes('heritage') || t.includes('fort') || t.includes('ancient') || t.includes('archaeological'));
        } else if (f === 'hidden' || f === 'hidden gems') {
          matchesFilter = place.isHiddenGem || pType === 'hidden' || pCat.includes('hidden') || pTags.some(t => ['hidden', 'hidden gem', 'peaceful', 'serene', 'off-beat', 'offbeat', 'untouched', 'quiet'].includes(t));
        } else {
          matchesFilter = directTypeMatch || directCatMatch || directTagMatch || directInterestMatch;
        }
      }

      return matchesSearch && matchesFilter;
    });

    const isLocalUser = userLocation && isWithinTirupatiRegion(userLocation.lat, userLocation.lng);
    const effectiveLocation = isLocalUser ? userLocation! : TIRUPATI_CENTER;
    result = result.map(p => {
      const toStr = (v: any) => typeof v === 'string' ? v : (v?.name || v?.slug || String(v || ''));
      const lat = p.coordinates?.lat || TIRUPATI_CENTER.lat;
      const lng = p.coordinates?.lng || TIRUPATI_CENTER.lng;
      const locStr = toStr(p.location).toLowerCase();
      const catStr = toStr(p.category).toLowerCase();
      const isTirumala = locStr.includes('tirumala') || 
                         locStr.includes('narayanagiri') || 
                         catStr.includes('tirumala');
      const dist = calculateDrivingDistance(effectiveLocation.lat, effectiveLocation.lng, lat, lng, isTirumala);
      return { ...p, computedDistance: dist } as any;
    });

    // Always sort by proximity (nearest to farthest)
    result.sort((a: any, b: any) => (a.computedDistance ?? 999) - (b.computedDistance ?? 999));

    return result;
  }, [searchQuery, activeFilter, places, userLocation, isAlternativeQuery, isTirupatiQuery]);

  const nearbyPlaces = useMemo(() => {
    return [...filteredPlaces]
      .sort((a: any, b: any) => (a.computedDistance ?? 999) - (b.computedDistance ?? 999))
      .slice(0, 10);
  }, [filteredPlaces]);

  const mustVisit = useMemo(() => {
    return filteredPlaces
      .filter((p: Place) => p.isMustVisit || (p.rating && p.rating >= 4.5) || (p as any).importanceLevel === 'iconic')
      .slice(0, 10);
  }, [filteredPlaces]);

  const hiddenGems = useMemo(() => {
    return filteredPlaces
      .filter((p: Place) => {
        const toStr = (v: any) => typeof v === 'string' ? v : (v?.name || v?.slug || String(v || ''));
        const tagsLower = (p.tags || []).map((t: any) => toStr(t).toLowerCase());
        const categoryLower = toStr(p.category).toLowerCase();
        const placeTypeLower = toStr(p.placeType).toLowerCase();
        const interestsLower = (p.interests || []).map((i: any) => toStr(i).toLowerCase());
        return (
          p.isHiddenGem ||
          placeTypeLower === 'hidden' ||
          categoryLower.includes('hidden') ||
          tagsLower.some((t: string) => ['hidden', 'hidden gem', 'peaceful', 'serene', 'off-beat', 'offbeat', 'untouched', 'quiet', 'nature'].includes(t)) ||
          interestsLower.includes('hidden')
        );
      })
      .slice(0, 10);
  }, [filteredPlaces]);

  const categoryCounts = useMemo(() => {
    const rawSource = places.length > 0 ? places : PLACES;
    const isLocalUser = userLocation && isWithinTirupatiRegion(userLocation.lat, userLocation.lng);
    const effectiveLocation = isLocalUser ? userLocation! : TIRUPATI_CENTER;
    const counts: Record<string, number> = {
      All: rawSource.length,
      Nearby: 0,
      Spiritual: 0,
      Nature: 0,
      Water: 0,
      Historical: 0,
      Hidden: 0,
      Culture: 0,
    };

    rawSource.forEach((place: Place) => {
      const pType = (place.placeType || '').toLowerCase();
      const pCat = (place.category || '').toLowerCase();

      // Nearby: places within 15 km
      const lat = place.coordinates?.lat || TIRUPATI_CENTER.lat;
      const lng = place.coordinates?.lng || TIRUPATI_CENTER.lng;
      const dist = calculateDrivingDistance(effectiveLocation.lat, effectiveLocation.lng, lat, lng, false);
      if (dist <= 15) counts.Nearby++;

      // Primary placeType-based counting (tight, accurate)
      if (pType === 'spiritual' || pCat.includes('temple')) counts.Spiritual++;
      if (pType === 'nature') counts.Nature++;
      if (pType === 'water') counts.Water++;
      if (pType === 'historical' || pCat.includes('fort')) counts.Historical++;
      if (pType === 'culture' || pType === 'leisure') counts.Culture++;
      if (place.isHiddenGem || pType === 'hidden') counts.Hidden++;
    });

    return counts;
  }, [places, userLocation]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={24} />
        </Link>
        <h1>{lang === 'te' ? 'దర్శనీయ ప్రదేశాలు & ఆలయాలు' : 'Explore Places'}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/alerts" aria-label="Notifications" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', textDecoration: 'none', color: '#0F5132' }}>
            <Bell size={20} />
          </Link>
          <button className={styles.filterIcon} onClick={() => { const el = document.getElementById('explore-filter-list'); el?.scrollIntoView({ behavior: 'smooth' }); }}>
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className={styles.stickyControls}>
        <div className={styles.searchBar}>
          <Search size={20} color="#999" />
          <input 
            type="text" 
            placeholder={lang === 'te' ? 'ఆలయాలు, జలపాతాలు, ప్రసాదం, చరిత్ర శోధించండి…' : 'Search places, temples, waterfalls, restaurants, history…'} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterList} id="explore-filter-list">
          {FILTERS_DATA.map((filter) => (
            <button
              key={filter.key}
              className={`${styles.filterItem} ${activeFilter === filter.key ? styles.activeFilter : ''}`}
              onClick={() => handleFilterClick(filter.key)}
            >
              {lang === 'te' ? filter.labelTe : filter.labelEn}
            </button>
          ))}
        </div>
      </div>

      <section className={styles.content}>
        <div className={styles.exploreLayout}>
          {/* Desktop Left Filter Sidebar */}
          <aside className={styles.sidebarFilter}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
              <Filter size={18} color="#059669" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {lang === 'te' ? 'వర్గాలు & ఫిల్టర్లు' : 'Explore Filters'}
              </h3>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                {lang === 'te' ? 'వర్గాలు' : 'Categories'}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {FILTERS_DATA.map((filter) => {
                  const count = categoryCounts[filter.key];
                  const isActive = activeFilter === filter.key;
                  return (
                    <button
                      key={filter.key}
                      onClick={() => handleFilterClick(filter.key)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: isActive ? '1px solid #A7F3D0' : '1px solid transparent',
                        background: isActive ? '#ECFDF5' : 'transparent',
                        color: isActive ? '#059669' : '#334155',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>{lang === 'te' ? filter.labelTe : filter.labelEn}</span>
                      {count !== undefined && count > 0 && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: isActive ? '#047857' : '#64748B',
                          background: isActive ? '#D1FAE5' : '#F1F5F9',
                          padding: '1.5px 7px',
                          borderRadius: '8px'
                        }}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className={styles.mainContentArea}>
            {locationError && (
              <div style={{
                background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px',
                padding: '10px 14px', marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'
              }}>
                <span style={{ fontSize: '12.5px', color: '#92400E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> Location unavailable — showing distances from Tirupati centre
                </span>
                <button onClick={() => setLocationError(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', flexShrink: 0 }}>✕</button>
              </div>
            )}
        {/* Nearby Places Section */}
        {filteredPlaces.length > 0 && (
          <div className={styles.curatedSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 className={styles.curatedTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                {lang === 'te' ? 'సమీపంలోని ప్రదేశాలు' : 'Nearby'} <MapPin size={18} style={{ color: '#2F6144' }} />
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LocationPill 
                  locationName={locationName || (userLocation ? 'GPS' : 'Tirupati')}
                  onClick={() => setIsLocationModalOpen(true)}
                  style={{ fontSize: '11px', padding: '3px 9px' }}
                />
              </div>
            </div>
            
            <LocationPickerModal
              isOpen={isLocationModalOpen}
              onClose={() => setIsLocationModalOpen(false)}
            />
            <div className={styles.horizontalScroll}>
              {nearbyPlaces.map((place) => {
                const dist = Number((place as any).computedDistance || 0);
                const locStr = String(place.location || '').toLowerCase();
                const isTirumala = locStr.includes('tirumala') || locStr.includes('narayanagiri') || String(place.category || '').toLowerCase().includes('tirumala');
                const driveMins = estimateDriveDuration(dist, isTirumala);
                const timeFormatted = formatTravelTime(driveMins, lang);

                let travelStr = '';
                if (dist <= 1.5) {
                  travelStr = lang === 'te' ? `${Math.max(1, Math.round(dist * 12))} నిమిషాలు • నడకదారి` : `${Math.max(1, Math.round(dist * 12))} mins • Walk`;
                } else if (dist <= 8.0) {
                  travelStr = lang === 'te' ? `${timeFormatted} • బైక్/ఆటో` : `${timeFormatted} • Bike`;
                } else {
                  travelStr = lang === 'te' ? `${timeFormatted} • బస్సు/కారు` : `${timeFormatted} • Bus/Car`;
                }

                return (
                  <Link href={`/place/${place.id}`} key={place.id} className={styles.curatedCard}>
                    <div className={styles.curatedImage} style={{ backgroundImage: `url(${place.image || 'https://images.unsplash.com/photo-1514222134-b57cbf8ce673?auto=format&fit=crop&q=80&w=800'})` }} />
                    <div className={styles.curatedInfo}>
                      <h4>{place.name}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                        <span style={{ color: '#2F6144', fontWeight: 800, fontSize: '11px' }}>
                          {dist < 0.5 ? (lang === 'te' ? '< 0.5 కి.మీ దూరం' : '< 0.5 km away') : `${dist.toFixed(1)} ${lang === 'te' ? 'కి.మీ దూరం' : 'km away'}`} • {travelStr}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}


              {/* Hidden Gems Section */}
              {hiddenGems.length > 0 && (
                <div className={styles.curatedSection}>
                  <h2 className={styles.curatedTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {lang === 'te' ? 'దాగి ఉన్న పవిత్ర క్షేత్రాలు' : 'Hidden Gems'} <Sparkles size={18} style={{ color: '#6C63FF' }} />
                  </h2>
                  <div className={styles.horizontalScroll}>
                    {hiddenGems.map((place) => (
                      <Link href={`/place/${place.id}`} key={place.id} className={styles.curatedCard}>
                        <div
                          className={styles.curatedImage}
                          style={{ backgroundImage: `url(${place.image || 'https://images.unsplash.com/photo-1514222134-b57cbf8ce673?auto=format&fit=crop&q=80&w=800'})` }}
                        >
                          {place.placeType && (
                            <span className={styles.curatedImageBadge}>{place.placeType}</span>
                          )}
                        </div>
                        <div className={styles.curatedInfo}>
                          <h4 title={place.name}>{place.name}</h4>
                          <div className={styles.curatedDistance}>
                            <MapPin size={10} strokeWidth={2.5} />
                            {Number((place as any).computedDistance || 0) < 0.5 ? '< 0.5 km' : `${Number((place as any).computedDistance || 0).toFixed(1)} km`}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

        {isAlternativeQuery && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            boxShadow: '0 2px 10px rgba(220,38,38,0.05)'
          }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'rgba(220, 38, 38, 0.1)', 
              color: '#DC2626', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={16} />
            </div>
            <div>
              <h4 style={{ fontSize: '13.5px', fontWeight: 900, color: '#991B1B', margin: '0 0 2px 0' }}>
                Heavy Crowds at Srivari Temple
              </h4>
              <p style={{ fontSize: '12.5px', color: '#7F1D1D', margin: 0, lineHeight: 1.45 }}>
                Srivari Venkateswara Swamy Temple is currently experiencing extremely heavy wait times. We highly recommend exploring these alternative temples and scenic destinations in Tirupati and Tirumala first to optimize your journey.
              </p>
            </div>
          </div>
        )}

        {isTirupatiQuery && (
          <div style={{
            background: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            boxShadow: '0 2px 10px rgba(245,158,11,0.05)'
          }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'rgba(245, 158, 11, 0.1)', 
              color: '#D97706', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Compass size={16} />
            </div>
            <div>
              <h4 style={{ fontSize: '13.5px', fontWeight: 900, color: '#92400E', margin: '0 0 2px 0' }}>
                Heavy Crowds at Tirumala
              </h4>
              <p style={{ fontSize: '12.5px', color: '#78350F', margin: 0, lineHeight: 1.45 }}>
                Tirumala temple is currently experiencing heavy wait times. We recommend exploring these foothill attractions in Tirupati city first and heading up to the hills later in the evening when wait times decrease.
              </p>
            </div>
          </div>
        )}

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {isAlternativeQuery 
              ? (lang === 'te' ? 'ప్రత్యామ్నాయ పవిత్ర దర్శనాలు' : 'Recommended Alternatives') 
              : isTirupatiQuery 
              ? (lang === 'te' ? 'తిరుపతి నగరంలోని ఆకర్షణలు' : 'Attractions in Tirupati City') 
              : searchQuery 
              ? (lang === 'te' ? `"${searchQuery}" ఫలితాలు` : `Results for "${searchQuery}"`) 
              : activeFilter === 'All' 
              ? (lang === 'te' ? 'అన్ని దర్శనీయ స్థలాలు' : 'All Experiences') 
              : (lang === 'te' ? `${FILTERS_DATA.find(f => f.key === activeFilter)?.labelTe || activeFilter} ప్రదేశాలు` : `${activeFilter} Places`)}
          </h2>
          <span className={styles.count}>
            {filteredPlaces.length} {filteredPlaces.length === 1 ? (lang === 'te' ? 'ప్రదేశం' : 'result') : (lang === 'te' ? 'ప్రదేశాలు' : 'results')}
          </span>
        </div>

        <div className={styles.templeList}>
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place: Place, index: number) => {
              const explainableReason = place.oneReasonToVisit || place.spiritualInfo?.knownFor || place.whyVisit?.split('.')[0];
              const crowd = place.saarthiIntelligence?.crowdLevel;

              return (
                <motion.div
                  key={place.id}
                  className={styles.templeItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/place/${place.id}`} className={styles.templeLink}>
                    <div 
                      className={styles.itemImage}
                      style={{ backgroundImage: `url(${place.image || 'https://images.unsplash.com/photo-1514222134-b57cbf8ce673?auto=format&fit=crop&q=80&w=800'})` }}
                    />
                    <div className={styles.itemInfo}>
                      <div className={styles.itemHeader}>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {place.name}
                        </h3>
                        <div className={styles.rating}>
                          <Star size={14} fill="#FF9933" color="#FF9933" />
                          <span>{place.rating}</span>
                        </div>
                      </div>

                      {/* Explainable Recommendation Badge */}
                      {explainableReason && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: '#FEF9C3',
                          color: '#854D0E',
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          padding: '2.5px 7px',
                          margin: '4px 0 6px 0',
                          border: '1px solid rgba(234, 179, 8, 0.25)',
                          lineHeight: 1.3
                        }}>
                          <Sparkles size={11} color="#CA8A04" style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                            {explainableReason}
                          </span>
                        </div>
                      )}

                      <p className={styles.description}>{place.description}</p>
                      
                      <div className={styles.tags} style={{ marginTop: '8px' }}>
                        {(place as any).computedDistance !== undefined ? (
                          <span className={styles.tag} style={{ backgroundColor: '#E5F3EB', color: '#2F6144', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} style={{ flexShrink: 0 }} />
                            {Number((place as any).computedDistance) < 0.5
                              ? (lang === 'te' ? '< 0.5 కి.మీ దూరం' : '< 0.5 km away')
                              : `${Number((place as any).computedDistance).toFixed(1)} ${lang === 'te' ? 'కి.మీ దూరం' : 'km away'}`}
                          </span>
                        ) : (
                          <span className={styles.tag}>{place.distanceKms} km from Tirupati</span>
                        )}

                        {crowd && (
                          <span className={styles.tag} style={{
                            backgroundColor: crowd === 'High' ? '#FEE2E2' : '#DCFCE7',
                            color: crowd === 'High' ? '#991B1B' : '#166534',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            ● {crowd} {lang === 'te' ? 'రద్దీ' : 'Crowd'}
                          </span>
                        )}

                        {(place.tags || []).slice(0, 3).map((tag: string) => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className={styles.noResults}>
              <p>{lang === 'te' ? 'మీ శోధనకు సరిపోలే ప్రదేశాలు ఏవీ కనుగొనబడలేదు.' : 'No places found matching your search.'}</p>
              {searchQuery.length >= 2 && crossResults.stories.length === 0 && crossResults.encyclopedia.length === 0 && (
                <p style={{ fontSize: 13, color: '#999', marginTop: 4 }}>
                  {lang === 'te' ? 'ఆలయాలు, పండుగలు, పురాణాలు లేదా స్థలాలను శోధించడానికి ప్రయత్నించండి.' : 'Try searching for temples, festivals, stories, or landmarks.'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Cross-Collection Results from Supabase */}
        {searchQuery.length >= 2 && (crossResults.stories.length > 0 || crossResults.encyclopedia.length > 0) && (
          <div style={{ marginTop: 24 }}>
            {crossResults.stories.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={18} color="#FF9933" /> Stories
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {crossResults.stories.slice(0, 4).map((story: any) => (
                    <Link href={story.slug ? `/learn/stories/${story.slug}` : `/learn/story-of-the-day`} key={story.id} style={{ textDecoration: 'none' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: 'linear-gradient(135deg, #FFF8F0, #FFF3E0)',
                          borderRadius: 12,
                          padding: '14px 16px',
                          border: '1px solid rgba(255,153,51,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        {story.image && (
                          <div style={{
                            width: 48, height: 48, borderRadius: 10,
                            backgroundImage: `url(${story.image})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            flexShrink: 0,
                          }} />
                        )}
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{story.title}</h4>
                          <p style={{ fontSize: 12, color: '#666', margin: '2px 0 0', lineHeight: 1.3 }}>{story.snippet?.slice(0, 80)}...</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {crossResults.encyclopedia.length > 0 && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GraduationCap size={18} color="#6C63FF" /> Encyclopedia
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {crossResults.encyclopedia.slice(0, 4).map((entry: any) => (
                    <Link href={`/learn?q=${encodeURIComponent(entry.title)}`} key={entry.id} style={{ textDecoration: 'none' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: 'linear-gradient(135deg, #F3F0FF, #EDE7F6)',
                          borderRadius: 12,
                          padding: '14px 16px',
                          border: '1px solid rgba(108,99,255,0.12)',
                          cursor: 'pointer',
                        }}
                      >
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{entry.title}</h4>
                        <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0', lineHeight: 1.4 }}>
                          {(entry.summary || entry.content || '').slice(0, 100)}...
                        </p>
                        {entry.category && (
                          <span style={{
                            display: 'inline-block', marginTop: 6,
                            fontSize: 11, padding: '2px 8px',
                            background: 'rgba(108,99,255,0.1)', borderRadius: 6,
                            color: '#6C63FF', fontWeight: 600,
                          }}>{entry.category}</span>
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </section>
</main>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
