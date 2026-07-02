'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Wallet, Navigation, Sparkles, Bookmark, ExternalLink } from 'lucide-react';
import styles from './Itinerary.module.css';
import { useTrip } from '@/components/TripContext';
import { PLACES, Place } from '@/data/places';

export default function ItineraryPage() {
  const { type } = useParams();
  const { generatedPlans, savePlan } = useTrip();
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetch('/api/admin/places')
      .then(r => r.json())
      .then(d => setPlaces(d.places || PLACES));
  }, []);

  const plan = generatedPlans?.find(p => p.type === type);

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
        title: `JeevaPath Itinerary: ${plan.title}`,
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
        <button className={`${styles.btnAction} ${styles.btnStart}`}>
          <Navigation size={20} />
          Start
        </button>
      </div>
    </div>
  );
}
