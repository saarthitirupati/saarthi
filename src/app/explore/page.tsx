'use client';

import { PLACES, Place } from '@/data/places';
import { Search, Star, Filter, ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
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
  
  const { places, loading: _loading } = useRealtimePlaces(PLACES);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('All');
  const { userLocation, setUserLocation, setLocationPermission } = useTrip();

  // Cross-collection search results from Supabase
  const [crossResults, setCrossResults] = useState<{ stories: any[]; encyclopedia: any[] }>({ stories: [], encyclopedia: [] });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Debounced cross-collection search
  const fetchCrossResults = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setCrossResults({ stories: [], encyclopedia: [] });
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
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

  const filters = ['All', 'Nearby', 'Spiritual', 'Nature', 'Water', 'Historical', 'Hidden', 'Leisure', 'Culture'];

  const handleFilterClick = (filter: string) => {
    if (filter === 'Nearby') {
      if (!userLocation) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
              setLocationPermission('granted');
              setActiveFilter('Nearby');
            },
            (error) => {
              alert("Unable to retrieve location. Defaulting to Tirupati center.");
              setUserLocation(TIRUPATI_CENTER);
              setLocationPermission('denied');
              setActiveFilter('Nearby');
            }
          );
        } else {
          alert("Geolocation is not supported by your browser. Defaulting to Tirupati center.");
          setUserLocation(TIRUPATI_CENTER);
          setLocationPermission('denied');
          setActiveFilter('Nearby');
        }
      } else {
        setActiveFilter('Nearby');
      }
    } else {
      setActiveFilter(filter);
    }
  };

  const filteredPlaces = useMemo(() => {
    const source = places.length > 0 ? places : PLACES;
    let result = source.filter((place: Place) => {
      const q = searchQuery.toLowerCase();
      const nameMatch = (place.name || '').toLowerCase().includes(q);
      const typeMatch = (place.placeType || '').toLowerCase().includes(q);
      const heritageMatch = q === 'heritage' && place.placeType === 'historical';
      const categoryMatch = (place.category || '').toLowerCase().includes(q);
      const godMatch = !!(place.spiritualInfo?.god && place.spiritualInfo.god.toLowerCase().includes(q));
      const tagsMatch = !!(place.tags && place.tags.some((tag: string) => tag.toLowerCase().includes(q)));
      const interestsMatch = !!(place.interests && place.interests.some((interest: string) => interest.toLowerCase().includes(q)));

      const matchesSearch = nameMatch || typeMatch || heritageMatch || categoryMatch || godMatch || tagsMatch || interestsMatch;
        
      const matchesFilter = activeFilter === 'All' || activeFilter === 'Nearby' || (place.placeType || '').toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });

    if (userLocation) {
      result = result.map(p => {
        const lat = p.coordinates?.lat || TIRUPATI_CENTER.lat;
        const lng = p.coordinates?.lng || TIRUPATI_CENTER.lng;
        const isTirumala = p.location.toLowerCase().includes('tirumala') || 
                           p.location.toLowerCase().includes('narayanagiri') || 
                           !!(p.category && p.category.toLowerCase().includes('tirumala'));
        const dist = calculateDrivingDistance(userLocation.lat, userLocation.lng, lat, lng, isTirumala);
        return { ...p, computedDistance: dist } as any;
      });

      if (activeFilter === 'Nearby') {
        result.sort((a: any, b: any) => (a.computedDistance ?? 999) - (b.computedDistance ?? 999));
      }
    }

    return result;
  }, [searchQuery, activeFilter, places, userLocation]);

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
            placeholder="Search places, stories, encyclopedia…" 
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
        {!searchQuery && activeFilter === 'All' && (() => {
          const source = places.length > 0 ? places : PLACES;
          const mustVisit = source.filter(p => p.rating >= 4.8).slice(0, 6);
          const hiddenGems = source.filter(p => {
            const tagsLower = p.tags.map(t => t.toLowerCase());
            const categoryLower = (p.category || '').toLowerCase();
            const placeTypeLower = (p.placeType || '').toLowerCase();
            const interestsLower = (p.interests || []).map(i => i.toLowerCase());
            return (
              placeTypeLower === 'hidden' ||
              categoryLower.includes('hidden') ||
              tagsLower.some(t => ['hidden', 'hidden gem', 'peaceful', 'serene', 'off-beat', 'offbeat', 'untouched', 'quiet'].includes(t)) ||
              interestsLower.includes('hidden')
            );
          }).slice(0, 6);

          return (
            <>
              <div className={styles.curatedSection}>
                <h2 className={styles.curatedTitle}>Must-Visit ✨</h2>
                <div className={styles.horizontalScroll}>
                  {mustVisit.map((place) => (
                    <Link href={`/place/${place.id}`} key={place.id} className={styles.curatedCard}>
                      <div className={styles.curatedImage} style={{ backgroundImage: `url(${place.image})` }} />
                      <div className={styles.curatedInfo}>
                        <h4>{place.name}</h4>
                        <span>⭐ {place.rating}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className={styles.curatedSection}>
                <h2 className={styles.curatedTitle}>Hidden Gems 💎</h2>
                <div className={styles.horizontalScroll}>
                  {hiddenGems.map((place) => (
                    <Link href={`/place/${place.id}`} key={place.id} className={styles.curatedCard}>
                      <div className={styles.curatedImage} style={{ backgroundImage: `url(${place.image})` }} />
                      <div className={styles.curatedInfo}>
                        <h4>{place.name}</h4>
                        <span>{place.placeType}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          );
        })()}

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : activeFilter === 'All' ? 'All Experiences' : `${activeFilter} Places`}
          </h2>
          <span className={styles.count}>{filteredPlaces.length} results</span>
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
                    style={{ backgroundImage: `url(${place.image})` }}
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
                        <span className={styles.tag} style={{ backgroundColor: '#E5F3EB', color: '#2F6144', fontWeight: 700 }}>
                          📍 {Number((place as any).computedDistance).toFixed(1)} km away
                        </span>
                      ) : (
                        <span className={styles.tag}>{place.distanceKms} km from Tirupati</span>
                      )}
                      {place.tags.map((tag: string) => (
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
