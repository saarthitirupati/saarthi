'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './Generating.module.css';
import { useTrip } from '@/components/TripContext';
import { generatePlans } from '@/lib/recommendation-engine';
import { PLACES } from '@/data/places';

const STATUS_MESSAGES = [
  '📍 Detecting your location...',
  '🗺️ Scanning 100+ local experiences...',
  '⏱️ Fitting stops to your time window...',
  '💰 Optimising for your budget...',
  '🚗 Planning the best route...',
  '🍛 Finding the top food spots...',
  '✨ Crafting your perfect itinerary...',
];

const CATEGORY_ICONS = ['🛕', '🌿', '🍛', '🏰', '🌊', '✨', '🎡', '🔭'];

export default function GeneratingPage() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const { plannerInput, setGeneratedPlans } = useTrip();
  const router = useRouter();

  // Pick random places for floating cards
  const randomPlaces = useMemo(() => {
    return [...PLACES].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  useEffect(() => {
    // Read from sessionStorage first (set synchronously by planner before navigation)
    // This avoids the async React state update lag in TripContext
    let input = plannerInput;
    try {
      const cached = sessionStorage.getItem('jeevapath_pending_plan');
      if (cached) {
        input = JSON.parse(cached);
        sessionStorage.removeItem('jeevapath_pending_plan');
      }
    } catch (e) {
      // fall back to TripContext value
    }

    // Generate plans immediately
    const runGeneration = async () => {
      try {
        const placesRes = await fetch('/api/admin/places');
        const { places } = await placesRes.json();
        const { plans, recommendations } = generatePlans(input, places);
        setGeneratedPlans(plans, recommendations);
      } catch (e) {
        console.error('Plan generation error:', e);
        // Fallback to static places if API fails
        const { plans, recommendations } = generatePlans(input);
        setGeneratedPlans(plans, recommendations);
      }
    };

    runGeneration();

    // Progress bar: 0→100 over ~4 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 38);

    // Navigate after completion
    const navTimer = setTimeout(() => {
      router.push('/plans');
    }, 4200);

    // Cycle status messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 1100);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(navTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      {/* Animated gradient background */}
      <div className={styles.gradientBg} />

      {/* Floating category icons */}
      <div className={styles.floatingIcons}>
        {CATEGORY_ICONS.map((icon, i) => (
          <motion.div
            key={i}
            className={styles.floatingIcon}
            style={{
              left: `${10 + (i * 11)}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.15, 0.5, 0.15],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2.8 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.35,
              ease: 'easeInOut',
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* Floating place preview cards */}
      <div className={styles.floatingCards}>
        {randomPlaces.map((place, i) => (
          <motion.div
            key={place.id}
            className={styles.floatingCard}
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{
              opacity: [0, 0.9, 0.9, 0],
              y: [60, 0, -20, -80],
              scale: [0.85, 1, 1, 0.9],
            }}
            transition={{
              duration: 4.5,
              delay: i * 1.4,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          >
            <div
              className={styles.placeThumb}
              style={{ backgroundImage: `url(${place.image})` }}
            />
            <span className={styles.placeName}>{place.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Animated map/route SVG */}
        <div className={styles.mapVisual}>
          <svg viewBox="0 0 200 120" className={styles.mapSvg}>
            {/* Route path */}
            <motion.path
              d="M 30,90 C 60,90 60,30 100,30 C 140,30 140,70 170,70"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
            />
            {/* Stop dots */}
            {[
              { cx: 30, cy: 90, delay: 0 },
              { cx: 100, cy: 30, delay: 0.8 },
              { cx: 170, cy: 70, delay: 1.6 },
            ].map((dot, i) => (
              <motion.circle
                key={i}
                cx={dot.cx}
                cy={dot.cy}
                r="5"
                fill="white"
                animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.8] }}
                transition={{ delay: dot.delay, duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
              />
            ))}
            {/* Pulse rings */}
            {[{ cx: 30, cy: 90 }, { cx: 100, cy: 30 }, { cx: 170, cy: 70 }].map((dot, i) => (
              <motion.circle
                key={`ring-${i}`}
                cx={dot.cx}
                cy={dot.cy}
                r="5"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                animate={{ r: [5, 14], opacity: [0.6, 0] }}
                transition={{ delay: i * 0.8, duration: 1.2, repeat: Infinity, repeatDelay: 2.2 }}
              />
            ))}
          </svg>
        </div>

        <div className={styles.textBlock}>
          <h1 className={styles.title}>Crafting your best day</h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              className={styles.statusMsg}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              {STATUS_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className={styles.progressArea}>
          <div className={styles.progressTrack}>
            <motion.div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>Generating your 3 plans</span>
            <span className={styles.progressPct}>{progress}%</span>
          </div>
        </div>

        {/* Step checklist */}
        <div className={styles.stepList}>
          {[
            { label: 'Finding matching places', threshold: 20 },
            { label: 'Optimising route order', threshold: 45 },
            { label: 'Calculating your budget', threshold: 65 },
            { label: 'Adding local tips',       threshold: 85 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={`${styles.stepItem} ${progress >= item.threshold ? styles.stepDone : ''}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.18 }}
            >
              <div className={styles.stepDot}>
                {progress >= item.threshold ? '✓' : ''}
              </div>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
