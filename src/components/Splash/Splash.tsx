'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  playSaarthiSonicIdent,
  stopSaarthiSonicIdent,
  isAudioGloballyEnabled
} from '@/lib/audioIdentity';
import styles from './Splash.module.css';

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleFinish = useCallback(() => {
    stopSaarthiSonicIdent();
    setIsVisible(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Trigger sacred opening sonic ident on splash mount
    if (isAudioGloballyEnabled()) {
      playSaarthiSonicIdent(true).catch(() => {});
    }

    const timer = setTimeout(() => {
      if (isMounted) {
        handleFinish();
      }
    }, 2800);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopSaarthiSonicIdent();
    };
  }, [handleFinish]);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {isVisible && (
        <motion.div
          className={styles.splashContainer}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: SMOOTH_EASE }}
          onClick={handleFinish}
        >
          {/* Central Brand Identity */}
          <motion.div
            className={styles.brandContent}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: SMOOTH_EASE }}
          >
            {/* Pure SVG Vector Tirumala Namam */}
            <div className={styles.namamFrame}>
              <svg
                viewBox="0 0 160 160"
                className={styles.namamSvg}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* White Namam U-Pillars */}
                <motion.g
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: SMOOTH_EASE }}
                >
                  {/* Left White Pillar */}
                  <path
                    d="M 42 22 L 62 22 C 64 62 70 95 76 117 C 73 120 66 120 61 116 C 53 95 46 60 42 22 Z"
                    fill="#F8F9FA"
                  />
                  {/* Right White Pillar */}
                  <path
                    d="M 118 22 L 98 22 C 96 62 90 95 84 117 C 87 120 94 120 99 116 C 107 95 114 60 118 22 Z"
                    fill="#F8F9FA"
                  />
                </motion.g>

                {/* Central Red Tilak (Sacred Kasturi Spindle) */}
                <motion.path
                  d="M 80 12 C 82.5 40 84.5 70 84.5 95 C 84.5 109 82 119 80 121 C 78 119 75.5 109 75.5 95 C 75.5 70 77.5 40 80 12 Z"
                  fill="#E52E2E"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: SMOOTH_EASE }}
                  style={{ transformOrigin: '80px 12px' }}
                />

                {/* Golden Base Dot */}
                <motion.circle
                  cx="80"
                  cy="137"
                  r="7.5"
                  fill="#E5B246"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ transformOrigin: '80px 137px' }}
                />
              </svg>
            </div>

            {/* Wordmark: SAARTHI */}
            <motion.h1
              className={styles.brandTitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: SMOOTH_EASE }}
            >
              SAARTHI
            </motion.h1>

            {/* Telugu Script: సారథి */}
            <motion.div
              className={styles.brandTelugu}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: SMOOTH_EASE }}
            >
              సారథి
            </motion.div>

            {/* Gold Divider Line */}
            <motion.div
              className={styles.divider}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45, ease: SMOOTH_EASE }}
            />

            {/* Tagline */}
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: SMOOTH_EASE }}
            >
              From Free Time to Meaningful Memories
            </motion.p>
          </motion.div>

          {/* Skip Action (Bottom Right) */}
          <motion.button
            type="button"
            className={styles.skipPill}
            aria-label="Skip splash screen and open app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
          >
            Skip &rarr;
          </motion.button>

          {/* Subdued Bottom Progress Line */}
          <div className={styles.loadingBarContainer}>
            <div className={styles.loadingBarFill} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}