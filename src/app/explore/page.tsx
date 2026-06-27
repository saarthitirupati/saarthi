'use client';

import { PLACES, Place } from '@/data/places';
import { Search, Star, Filter, ArrowLeft } from 'lucide-react';
import { useState, useMemo, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import styles from './Explore.module.css';
import { calculateDistance, TIRUPATI_CENTER } from '@/utils/location';
import { useTrip } from '@/components/TripContext';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const { places, loading } = useRealtimePlaces(PLACES);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('All');
  const { userLocation, setUserLocation, setLocationPermission } = useTrip();

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const filters = ['All', 'Nearby', 'Spiritual', 'Nature', 'Water', 'Food', 'Historical', 'Hidden', 'Leisure', 'Culture'];

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
      const matchesSearch = 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.placeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (searchQuery.toLowerCase() === 'heritage' && place.placeType === 'historical') ||
        (place.category && place.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (place.spiritualInfo && place.spiritualInfo.god.toLowerCase().includes(searchQuery.toLowerCase())) ||
        place.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (place.interests && place.interests.some((interest: string) => interest.toLowerCase().includes(searchQuery.toLowerCase())));
        
      const matchesFilter = activeFilter === 'All' || activeFilter === 'Nearby' || place.placeType.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });

    if (userLocation) {
      result = result.map(p => {
        const lat = p.coordinates?.lat || TIRUPATI_CENTER.lat;
        const lng = p.coordinates?.lng || TIRUPATI_CENTER.lng;
        const dist = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
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
        <button className={styles.filterIcon}>
          <Filter size={20} />
        </button>
      </header>

      <div className={styles.stickyControls}>
        <div className={styles.searchBar}>
          <Search size={20} color="#999" />
          <input 
            type="text" 
            placeholder="Find a place..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterList}>
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
            </div>
          )}
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
