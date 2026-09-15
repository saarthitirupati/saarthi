'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Splash.module.css';

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        handleFinish();
      }
    }, 2400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
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
          {/* Skip Action */}
          <button
            type="button"
            className={styles.skipPill}
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
          >
            Skip →
          </button>

          {/* Central Brand Identity */}
          <motion.div
            className={styles.brandContent}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: SMOOTH_EASE }}
          >
            {/* Clean, Vector Tirumala Namam Mark */}
            <div className={styles.namamFrame}>
              <svg
                viewBox="0 0 200 240"
                className={styles.namamSvg}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Left White Pillar (Shankha-white) */}
                <path
                  d="M 40 30 L 76 30 L 96 170 C 93 170 88 170 82 166 L 40 30 Z"
                  fill="#F8FAFC"
                />
                {/* Right White Pillar */}
                <path
                  d="M 160 30 L 124 30 L 104 170 C 107 170 112 170 118 166 L 160 30 Z"
                  fill="#E2E8F0"
                />
                {/* U-Base Curve */}
                <path
                  d="M 82 166 C 92 180 108 180 118 166 C 110 172 90 172 82 166 Z"
                  fill="#F8FAFC"
                />
                {/* Outer Subtle Golden Rim */}
                <path
                  d="M 38 28 L 78 28 M 122 28 L 162 28"
                  stroke="#C89B3C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Central Sacred Vermilion Srichoornam Tilakam */}
                <path
                  d="M 100 20 C 91 60 88 115 95 162 C 97 170 100 174 100 174 C 100 174 103 170 105 162 C 112 115 109 60 100 20 Z"
                  fill="#DC2626"
                />
                {/* Tilakam Crown Jewel */}
                <polygon
                  points="100,12 105,20 100,24 95,20"
                  fill="#C89B3C"
                />
              </svg>
            </div>

            {/* Wordmark: SAARTHI */}
            <h1 className={styles.brandTitle}>SAARTHI</h1>

            {/* Telugu Script: సారథి */}
            <div className={styles.brandTelugu}>సారథి</div>

            {/* Restrained Gold Divider */}
            <div className={styles.divider} />

            {/* Authentic Product Tagline */}
            <p className={styles.tagline}>
              From Free Time to Meaningful Memories
            </p>
          </motion.div>

          {/* Subdued Bottom Loading Line */}
          <div className={styles.loadingBarContainer}>
            <div className={styles.loadingBarFill} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}