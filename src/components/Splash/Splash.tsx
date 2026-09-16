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

    // First Principles: Pure visual vector splash screen with ZERO background audio playback
    const timer = setTimeout(() => {
      if (isMounted) {
        handleFinish();
      }
    }, 2800);

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
          style={{
            background: 'radial-gradient(circle at 50% 40%, #08251B 0%, #04150F 70%, #020C08 100%)'
          }}
        >
          {/* Central Brand Identity & Sacred Vector Artwork */}
          <motion.div
            className={styles.brandContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: SMOOTH_EASE }}
          >
            {/* Vector Sacred Temple Vimana Art */}
            <motion.div
              style={{
                width: 'min(240px, 60vw)',
                height: 'min(240px, 60vw)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: SMOOTH_EASE }}
            >
              <img
                src="/assets/splash_vimana_art.png"
                alt="Saarthi Guide Sacred Temple Vector"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 20px rgba(229, 178, 70, 0.25))'
                }}
              />
            </motion.div>

            {/* Wordmark: Saarthi Guide */}
            <motion.h1
              style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: 'clamp(28px, 6.5vw, 38px)',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.12em',
                margin: '0 0 6px 0',
                lineHeight: 1.15
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: SMOOTH_EASE }}
            >
              Saarthi Guide
            </motion.h1>

            {/* Subtitle: Spiritual Pilgrim Companion */}
            <motion.div
              style={{
                fontSize: 'clamp(12px, 3vw, 13.5px)',
                fontWeight: 600,
                color: '#E5B246',
                letterSpacing: '0.08em',
                margin: '0 0 14px 0',
                textTransform: 'none'
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: SMOOTH_EASE }}
            >
              Spiritual Pilgrim Companion
            </motion.div>

            {/* Sacred Three Gold Dots */}
            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#E5B246',
                fontSize: '10px',
                opacity: 0.8,
                marginBottom: '28px'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span>•</span>
              <span style={{ fontSize: '12px' }}>🌸</span>
              <span>•</span>
            </motion.div>

            {/* SKIP Pill Action Button (Centered Bottom as in Image 2) */}
            <motion.button
              type="button"
              aria-label="Skip splash screen and open app"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              onClick={(e) => {
                e.stopPropagation();
                handleFinish();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 22px',
                borderRadius: '20px',
                background: 'rgba(4, 21, 15, 0.6)',
                border: '1px solid rgba(229, 178, 70, 0.45)',
                color: '#E5B246',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              SKIP &rarr;
            </motion.button>
          </motion.div>

          {/* Subdued Bottom Progress Line */}
          <div className={styles.loadingBarContainer}>
            <div className={styles.loadingBarFill} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}