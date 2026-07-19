'use client';

import { useEffect, useState } from 'react';
import { Place } from '@/types/place';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { useTrip } from '@/components/TripContext';
import { Heart, Clock, Star, MapPin, Trash2, ArrowLeft, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Saved.module.css';

import { calculateDistance, calculateDrivingDistance } from '@/utils/location';

export default function SavedPage() {
  const { places, loading } = useRealtimePlaces();

  const { savedPlaces, viewedPlaces, togglePlace, clearViewedHistory, userLocation } = useTrip();

  const savedList = places.filter(p => savedPlaces.includes(p.id));
  
  // For history, we want to maintain the order in viewedPlaces array
  const historyList = (viewedPlaces || [])
    .map(id => places.find(p => p.id === id))
    .filter((p): p is Place => !!p);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} title="Back to Home">
          <ArrowLeft size={24} />
        </Link>
        <h1 className={styles.title}>Saves & History</h1>
      </header>

      <section className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Scanning saves...</div>
        ) : (
          <div className={styles.sectionsContainer}>
            {/* ─── SAVED PLACES SECTION ─── */}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Saved Places</h2>
              <span className={styles.countBadge}>{savedList.length}</span>
            </div>

            {savedList.length > 0 ? (
              <div className={styles.listGrid}>
                {savedList.map((place, idx) => (
                  <motion.div 
                    key={place.id} 
                    className={styles.card}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/place/${place.id}`} className={styles.cardLink}>
                      <div 
                        className={styles.cardImage}
                        style={{ backgroundImage: `url(${place.image})` }}
                      />
                      <div className={styles.cardInfo}>
                        <div className={styles.cardHeader}>
                          <span className={styles.category}>{place.category}</span>
                          <div className={styles.rating}>
                            <Star size={12} fill="#FFD700" color="#FFD700" />
                            <span>{place.rating}</span>
                          </div>
                        </div>
                        <h3>{place.name}</h3>
                        <div className={styles.location}>
                          <MapPin size={12} />
                          <span>
                            {place.location} • {userLocation && place.coordinates
                              ? `${calculateDrivingDistance(userLocation.lat, userLocation.lng, place.coordinates.lat, place.coordinates.lng, place.location.toLowerCase().includes('tirumala') || place.location.toLowerCase().includes('narayanagiri') || !!(place.category && place.category.toLowerCase().includes('tirumala'))).toFixed(1)} km away`
                              : `${place.distanceKms} km`}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <button 
                      className={styles.unsaveBtn}
                      onClick={() => togglePlace(place.id)}
                      title="Remove from saved"
                    >
                      <Heart size={18} fill="var(--color-saffron-500)" color="var(--color-saffron-500)" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Bookmark size={48} className="text-stone-300" />
                <h3>No saved places yet</h3>
                <p>Tap the heart icon on any place page to bookmark it here.</p>
                <Link href="/explore" className={styles.exploreLink}>
                  Browse Places
                </Link>
              </div>
            )}

            <div className={styles.sectionDivider} />

            {/* ─── RECENTLY VIEWED SECTION ─── */}
            <div className={styles.sectionHeader}>
              <div className={styles.historyTitleRow}>
                <h2 className={styles.sectionTitle}>Recently Viewed</h2>
                {historyList.length > 0 && (
                  <button 
                    className={styles.clearBtn}
                    onClick={clearViewedHistory}
                    title="Clear all viewed history"
                  >
                    <Trash2 size={14} />
                    <span>Clear History</span>
                  </button>
                )}
              </div>
            </div>

            {historyList.length > 0 ? (
              <div className={styles.historyList}>
                {historyList.map((place, idx) => (
                  <motion.div 
                    key={`hist-${place.id}-${idx}`} 
                    className={styles.historyCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/place/${place.id}`} className={styles.historyCardLink}>
                      <div 
                        className={styles.historyCardImage}
                        style={{ backgroundImage: `url(${place.image})` }}
                      />
                      <div className={styles.historyCardInfo}>
                        <h3>{place.name}</h3>
                        <p>{place.location} • {place.category}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyStateMini}>
                <Clock size={32} className="text-stone-300" />
                <p>No recently viewed places.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
