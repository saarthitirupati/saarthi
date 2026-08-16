'use client';

import { PLACES, Place } from '@/data/places';
import { Search, Star, Filter, ArrowLeft, BookOpen, GraduationCap, MapPin, Sparkles, AlertTriangle, Compass } from 'lucide-react';
import { useState, useMemo, Suspense, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import styles from './Explore.module.css';
import { calculateDrivingDistance, TIRUPATI_CENTER } from '@/utils/location';
import { useTrip } from '@/components/TripContext';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialFilter = searchParams.get('category') || searchParams.get('filter') || '';
  
  const filters = ['All', 'Nearby', 'Spiritual', 'Nature', 'Water', 'Historical', 'Hidden', 'Leisure', 'Culture'];
  const { places, loading: _loading } = useRealtimePlaces(PLACES);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('All');
  const [locationError, setLocationError] = useState(false);
  const { userLocation, setUserLocation, setLocationPermission } = useTrip();

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

      const toStr = (v: any) => typeof v === 'string' ? v : (v?.name || v?.slug || String(v || ''));
      const q = searchQuery.trim().toLowerCase();

      // Explicit Alias Map for robust pilgrim search intents
      let searchTerms = [q];
      if (q === 'hanuman' || q === 'anjaneya') {
        searchTerms.push('japali', 'bedi anjaneya', 'prasanna anjaneya');
      } else if (q === 'waterfall' || q === 'waterfalls' || q === 'falls') {
        searchTerms.push('talakona', 'nagala', 'kailasa', 'tada', 'kapila');
      } else if (q === 'appalayagunta' || q === 'appalaya') {
        searchTerms.push('prasanna venkateswara', 'appalayagunta');
      } else if (q === 'jain' || q === 'jainism' || q === 'dharamshala' || q === 'parshwanath') {
        searchTerms.push('jain', 'parshwanath', 'shwetambar', 'dharamshala');
      }

      const nameMatch = searchTerms.some(term => toStr(place.name).toLowerCase().includes(term));
      const locationMatch = searchTerms.some(term => toStr(place.location).toLowerCase().includes(term));
      const addressMatch = searchTerms.some(term => toStr(place.address).toLowerCase().includes(term));
      const idMatch = searchTerms.some(term => toStr(place.id).toLowerCase().includes(term));
      const descMatch = searchTerms.some(term => toStr(place.description || place.shortIntro).toLowerCase().includes(term));
      const typeMatch = searchTerms.some(term => toStr(place.placeType).toLowerCase().includes(term));
      const heritageMatch = q === 'heritage' && (place.placeType === 'historical' || toStr(place.category).toLowerCase().includes('core temple'));
      const categoryMatch = searchTerms.some(term => toStr(place.category).toLowerCase().includes(term));
      const godMatch = !!(place.spiritualInfo?.god && searchTerms.some(term => toStr(place.spiritualInfo?.god).toLowerCase().includes(term)));
      const tagsMatch = !!(place.tags && Array.isArray(place.tags) && place.tags.some((tag: any) => searchTerms.some(term => toStr(tag).toLowerCase().includes(term))));
      const interestsMatch = !!(place.interests && Array.isArray(place.interests) && place.interests.some((interest: any) => searchTerms.some(term => toStr(interest).toLowerCase().includes(term))));

      const matchesSearch = !q || nameMatch || locationMatch || addressMatch || idMatch || descMatch || typeMatch || heritageMatch || categoryMatch || godMatch || tagsMatch || interestsMatch;
        
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
          matchesFilter = directTypeMatch || directCatMatch || directTagMatch || directInterestMatch || pType === 'spiritual' || pCat.includes('temple');
        } else if (f === 'culture') {
          matchesFilter = directTypeMatch || directCatMatch || directTagMatch || directInterestMatch || pType === 'spiritual' || pType === 'historical' || pCat.includes('heritage') || pCat.includes('culture');
        } else if (f === 'water' || f === 'nature') {
          matchesFilter = directTypeMatch || directCatMatch || directTagMatch || pCat.includes('waterfall') || pCat.includes('theertham') || pCat.includes('nature') || pTags.some(t => t.includes('water') || t.includes('theertham') || t.includes('nature'));
        } else if (f === 'historical' || f === 'history' || f === 'heritage') {
          matchesFilter = directTypeMatch || pType === 'historical' || pCat.includes('history') || pCat.includes('heritage') || pCat.includes('core temple') || pTags.some(t => t.includes('history') || t.includes('heritage'));
        } else if (f === 'hidden') {
          matchesFilter = directTypeMatch || place.isHiddenGem || pCat.includes('hidden') || pTags.some(t => t.includes('hidden'));
        } else {
          matchesFilter = directTypeMatch || directCatMatch || directTagMatch || directInterestMatch;
        }
      }

      return matchesSearch && matchesFilter;
    });

    const effectiveLocation = userLocation || TIRUPATI_CENTER;
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

    if (activeFilter === 'Nearby') {
      result.sort((a: any, b: any) => (a.computedDistance ?? 999) - (b.computedDistance ?? 999));
    }

    return result;
  }, [searchQuery, activeFilter, places, userLocation, isAlternativeQuery, isTirupatiQuery]);

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

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={24} />
        </Link>
        <h1>Explore Places</h1>
        <button className={styles.filterIcon} onClick={() => { const el = document.getElementById('explore-filter-list'); el?.scrollIntoView({ behavior: 'smooth' }); }}>
          <Filter size={20} />
        </button>
      </header>

      <div className={styles.stickyControls}>
        <div className={styles.searchBar}>
          <Search size={20} color="#999" />
          <input 
            type="text" 
            placeholder="Search places, temples, waterfalls, restaurants, history…" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterList} id="explore-filter-list">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`${styles.filterItem} ${activeFilter === filter ? styles.activeFilter : ''}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
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
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Explore Filters</h3>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                Categories
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: activeFilter === filter ? '#ECFDF5' : 'transparent',
                      color: activeFilter === filter ? '#059669' : '#334155',
                      fontWeight: activeFilter === filter ? 800 : 600,
                      fontSize: '13px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>{filter}</span>
                    {activeFilter === filter && <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>}
                  </button>
                ))}
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
                Nearby <MapPin size={18} style={{ color: '#2F6144' }} />
              </h2>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800, background: '#DCFCE7', padding: '2px 8px', borderRadius: '12px' }}>
                {userLocation ? 'Live GPS Distance' : 'Nearest First'}
              </span>
            </div>
            <div className={styles.horizontalScroll}>
              {filteredPlaces.slice(0, 10).map((place) => {
                const dist = Number((place as any).computedDistance || 0);
                let travelStr = '';
                if (dist <= 1.5) {
                  travelStr = `${Math.max(1, Math.round(dist * 12))} mins • Walk`;
                } else if (dist <= 8.0) {
                  travelStr = `${Math.max(2, Math.round(dist * 2.5))} mins • Bike`;
                } else {
                  travelStr = `${Math.max(5, Math.round(dist * 2.0))} mins • Bus/Car`;
                }

                return (
                  <Link href={`/place/${place.id}`} key={place.id} className={styles.curatedCard}>
                    <div className={styles.curatedImage} style={{ backgroundImage: `url(${place.image || 'https://images.unsplash.com/photo-1514222134-b57cbf8ce673?auto=format&fit=crop&q=80&w=800'})` }} />
                    <div className={styles.curatedInfo}>
                      <h4>{place.name}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                        <span style={{ color: '#2F6144', fontWeight: 800, fontSize: '11px' }}>
                          {dist < 0.5 ? '< 0.5 km away' : `${dist.toFixed(1)} km away`} • {travelStr}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
              {/* Must-Visit Section */}
              {mustVisit.length > 0 && (
                <div className={styles.curatedSection}>
                  <h2 className={styles.curatedTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Must-Visit <Sparkles size={18} style={{ color: '#FF9933' }} />
                  </h2>
                  <div className={styles.horizontalScroll}>
                    {mustVisit.map((place) => (
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#B0550C', fontWeight: 700 }}>
                              <Star size={11} fill="#F59E0B" color="#F59E0B" /> {place.rating}
                            </span>
                            <span className={styles.curatedDistance} style={{ gap: '2px' }}>
                              <MapPin size={10} strokeWidth={2.5} />
                              {Number((place as any).computedDistance || 0) < 0.5 ? '< 0.5 km' : `${Number((place as any).computedDistance || 0).toFixed(1)} km`}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Hidden Gems Section */}
              {hiddenGems.length > 0 && (
                <div className={styles.curatedSection}>
                  <h2 className={styles.curatedTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Hidden Gems <Sparkles size={18} style={{ color: '#6C63FF' }} />
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
            {isAlternativeQuery ? 'Recommended Alternatives' : isTirupatiQuery ? 'Attractions in Tirupati City' : searchQuery ? `Results for "${searchQuery}"` : activeFilter === 'All' ? 'All Experiences' : `${activeFilter} Places`}
          </h2>
          <span className={styles.count}>
            {filteredPlaces.length} {filteredPlaces.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        <div className={styles.templeList}>
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place: Place, index: number) => (
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
                      <h3>{place.name}</h3>
                      <div className={styles.rating}>
                        <Star size={14} fill="#FF9933" color="#FF9933" />
                        <span>{place.rating}</span>
                      </div>
                    </div>
                    <p className={styles.description}>{place.description}</p>
                    <div className={styles.tags}>
                      {(place as any).computedDistance !== undefined ? (
                        <span className={styles.tag} style={{ backgroundColor: '#E5F3EB', color: '#2F6144', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} style={{ flexShrink: 0 }} /> {Number((place as any).computedDistance).toFixed(1)} km away
                        </span>
                      ) : (
                        <span className={styles.tag}>{place.distanceKms} km from Tirupati</span>
                      )}
                      {(place.tags || []).map((tag: string) => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No places found matching your search.</p>
              {searchQuery.length >= 2 && crossResults.stories.length === 0 && crossResults.encyclopedia.length === 0 && (
                <p style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Try searching for temples, festivals, stories, or landmarks.</p>
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
