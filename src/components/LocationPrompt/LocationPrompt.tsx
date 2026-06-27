'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { useTrip } from '@/components/TripContext';
import styles from './LocationPrompt.module.css';
import { useState } from 'react';

export default function LocationPrompt() {
  const { setUserLocation, setLocationPermission } = useTrip();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllowLocation = () => {
    setIsRequesting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission('granted');
          setIsRequesting(false);
        },
        (error) => {
          console.warn("User denied location or error occurred:", error);
          setLocationPermission('denied');
          setIsRequesting(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocationPermission('denied');
      setIsRequesting(false);
    }
  };

  const handleNotNow = () => {
    setLocationPermission('denied');
  };

  return (
    <div className={styles.container}>
      {/* Background Stylized Map Graphic */}
      <div className={styles.mapBackground}>
        {/* Simple stylized SVG grid representing city roads and rivers */}
        <svg className={styles.mapSvg} viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* River */}
          <path d="M-50,200 C100,250 250,150 450,220" stroke="#DCEBE2" strokeWidth="16" strokeLinecap="round" />
          <path d="M-50,200 C100,250 250,150 450,220" stroke="#E3F2E9" strokeWidth="8" strokeLinecap="round" />
          
          {/* Main Highway */}
          <path d="M100,-50 L120,850" stroke="#F5ECE0" strokeWidth="8" />
          <path d="M100,-50 L120,850" stroke="#FCF8F2" strokeWidth="2" strokeDasharray="6,6" />
          
          {/* Cross Roads */}
          <path d="M-50,450 C150,420 200,480 450,440" stroke="#F5ECE0" strokeWidth="6" />
          <path d="M-50,100 L450,300" stroke="#F5ECE0" strokeWidth="4" />
          <path d="M-50,650 L450,550" stroke="#F5ECE0" strokeWidth="4" />
          
          {/* Minor Lanes */}
          <path d="M300,-50 L280,850" stroke="#F7EFE4" strokeWidth="3" />
          <path d="M-50,320 L250,310 L280,850" stroke="#F7EFE4" strokeWidth="3" />
          <path d="M120,380 L450,350" stroke="#F7EFE4" strokeWidth="2" />
        </svg>

        {/* Circular Grid Rings */}
        <div className={styles.radarRing1} />
        <div className={styles.radarRing2} />
        <div className={styles.radarRing3} />
      </div>

      {/* Floating Animated Location Pin */}
      <div className={styles.pinContainer}>
        <motion.div
          className={styles.pinGlow}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.6, 0.1, 0.6]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={styles.pinWrapper}
          animate={{
            y: [0, -14, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className={styles.pinCircle}>
            <MapPin size={42} color="#E9801D" fill="#FFF3E8" strokeWidth={2} />
          </div>
        </motion.div>
      </div>

      {/* Content Area */}
      <motion.div 
        className={styles.contentCard}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        <h2 className={styles.title}>Enable Location</h2>
        <p className={styles.description}>
          Allow location to find nearby places, show accurate distance and the best routes.
        </p>

        <div className={styles.actionButtons}>
          <motion.button
            className={styles.allowBtn}
            onClick={handleAllowLocation}
            disabled={isRequesting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isRequesting ? (
              <span className={styles.loadingSpinner}>Detecting Location...</span>
            ) : (
              <>
                <Navigation size={18} />
                <span>Allow Location</span>
              </>
            )}
          </motion.button>

          <button 
            className={styles.notNowBtn} 
            onClick={handleNotNow}
            disabled={isRequesting}
          >
            Not Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
