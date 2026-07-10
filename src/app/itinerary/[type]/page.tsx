'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Wallet, Navigation, Sparkles, Bookmark, ExternalLink } from 'lucide-react';
import styles from './Itinerary.module.css';
import { useTrip } from '@/components/TripContext';
import { PLACES, Place } from '@/data/places';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { calculateDistance } from '@/utils/location';

export default function ItineraryPage() {
  const { type } = useParams();
  const { generatedPlans, savePlan, userLocation } = useTrip();
  const router = useRouter();
  const { places } = useRealtimePlaces(PLACES);

  const plan = generatedPlans?.find(p => p.type === type);

  const startRouteUrl = useMemo(() => {
    if (!plan || plan.stops.length === 0) return '#';
    const activePlaces = places.length > 0 ? places : PLACES;
    const coords = plan.stops
      .map(stop => activePlaces.find(p => p.id === stop.placeId)?.coordinates)
      .filter(Boolean) as { lat: number; lng: number }[];
    if (coords.length === 0) return '#';
    
    const originStr = userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : '';
    const destination = coords[coords.length - 1];
    const destinationStr = `&destination=${destination.lat},${destination.lng}`;
    
    const waypoints = coords.slice(0, -1);
    const waypointsStr = waypoints.length > 0
      ? `&waypoints=${waypoints.map(w => `${w.lat},${w.lng}`).join('|')}`
      : '';
      
    return `https://www.google.com/maps/dir/?api=1${originStr}${destinationStr}${waypointsStr}&travelmode=driving`;
  }, [plan, places, userLocation]);

  if (!plan) {
    return <div className={styles.container}>Plan not found</div>;
  }

  const handleSave = () => {
    savePlan(plan);
    alert('Plan saved to your collection!');
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Saarthi Itinerary: ${plan.title}`,
        text: `Check out this journey: ${plan.tagline}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleRegenerate = () => {
    if (confirm('Re-plan this journey? You might get different stops or timings.')) {
      router.push('/planner');
    }
  };

  const centerLat = 13.6288;
  const centerLng = 79.4192;
  
  // Calculate dynamic bounding box based on plan stops
  let bbox = `${centerLng-0.15},${centerLat-0.15},${centerLng+0.15},${centerLat+0.15}`;
  if (plan && plan.stops.length > 0) {
    const stopCoords = plan.stops
      .map(stop => (places.length > 0 ? places : PLACES).find(p => p.id === stop.placeId)?.coordinates)
      .filter(Boolean) as { lat: number; lng: number }[];
    
    if (stopCoords.length > 0) {
      const lats = stopCoords.map(c => c.lat);
      const lngs = stopCoords.map(c => c.lng);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      const latPadding = Math.max(0.04, (maxLat - minLat) * 0.4);
      const lngPadding = Math.max(0.04, (maxLng - minLng) * 0.4);
      bbox = `${minLng - lngPadding},${minLat - latPadding},${maxLng + lngPadding},${maxLat + latPadding}`;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mapHeader}>
        <iframe 
          className={styles.mapIframe}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`}
        />
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ChevronLeft size={24} />
        </button>
        <button onClick={handleRegenerate} className={styles.regenerateBtn} title="Regenerate">
          <Sparkles size={20} />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.aiInsight}>
          <Sparkles size={20} color="var(--color-teal-500)" />
          <p>&quot;AI Insight: This path minimises travel time while maximising your experience across {plan.stops.length} curated stops.&quot;</p>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{Math.floor(plan.totalMins / 60)}h {plan.totalMins % 60}m</span>
            <span className={styles.statLab}>Duration</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>₹{plan.totalCost}</span>
            <span className={styles.statLab}>Est. Cost</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{plan.stops.length}</span>
            <span className={styles.statLab}>Stops</span>
          </div>
        </div>

        <div className={styles.timeline}>
          {plan.stops.map((stop, idx) => {
            const place = (places.length > 0 ? places : PLACES).find(p => p.id === stop.placeId);
            if (!place) return null;

            return (
              <div key={idx} className={styles.stopWrapper}>
                <div className={styles.leftColumn}>
                  <span className={styles.time}>{stop.arrivalTime}</span>
                  <div className={styles.lineWrapper}>
                    <div className={styles.dot} />
                    {idx < plan.stops.length - 1 && <div className={styles.line} />}
                  </div>
                </div>

                <div className={styles.rightColumn}>
                  <motion.div 
                    className={styles.stopCard}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => router.push(`/place/${place.id}`)}
                  >
                    <div className={styles.stopImage} style={{ backgroundImage: `url(${place.image})` }} />
                    <div className={styles.stopInfo}>
                      <div className={styles.stopHeader}>
                        <h3 className={styles.stopTitle}>{place.name}</h3>
                        <span className={styles.stopType}>{place.placeType}</span>
                      </div>
                      
                      <div className={styles.stopMeta}>
                        <div className={styles.metaItem}>
                          <Clock size={12} />
                          <span>{place.durationMins}m</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Wallet size={12} />
                          <span>₹{stop.estimatedCost}</span>
                        </div>
                        {userLocation && place.coordinates && (
                          <div className={styles.metaItem} style={{ color: 'var(--color-saffron-600)', fontWeight: 600 }}>
                            <Navigation size={12} />
                            <span>{calculateDistance(userLocation.lat, userLocation.lng, place.coordinates.lat, place.coordinates.lng).toFixed(1)} km</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {idx < plan.stops.length - 1 && (
                    <div className={styles.travelInfo}>
                      <Navigation size={12} />
                      <span>{stop.travelToNext} mins travel</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.actionBar}>
        <button onClick={handleSave} className={`${styles.btnAction} ${styles.btnSave}`}>
          <Bookmark size={20} />
          Save
        </button>
        <button onClick={handleShare} className={`${styles.btnAction} ${styles.btnShare}`}>
          <ExternalLink size={20} />
          Share
        </button>
        <a 
          href={startRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.btnAction} ${styles.btnStart}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <Navigation size={20} />
          Start
        </a>
      </div>
    </div>
  );
}
