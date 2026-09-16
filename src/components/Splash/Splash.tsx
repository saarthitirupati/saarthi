'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  playBeadComplete,
  isAudioGloballyEnabled
} from '@/lib/audioIdentity';
import styles from './Splash.module.css';

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Trigger crisp sacred temple bell chime on splash mount (ZERO background music)
    if (isAudioGloballyEnabled()) {
      try {
        playBeadComplete();
      } catch {}
    }

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
            background: 'linear-gradient(160deg, #02140D 0%, #031A12 50%, #010E08 100%)'
          }}
        >
          {/* Subtle Warm Golden Ambient Glow (matching exact screenshot) */}
          <div
            style={{
              position: 'absolute',
              top: '45%',
              right: '15%',
              transform: 'translate(0, -50%)',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 75%)',
              filter: 'blur(35px)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* Central Brand Content */}
          <motion.div
            className={styles.brandContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            {/* Pure SVG Vector Sacred Srivari Temple Vimana Geometry */}
            <motion.div
              style={{
                width: 'min(270px, 70vw)',
                height: 'min(270px, 70vw)',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: SMOOTH_EASE }}
            >
              <svg
                viewBox="0 0 320 380"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Celestial Dotted Orbit Circle */}
                <motion.circle
                  cx="160"
                  cy="200"
                  r="135"
                  stroke="#E5B246"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                  opacity="0.7"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '160px 200px' }}
                />

                {/* Top Radiant Kalasam Star Geometry */}
                <g>
                  <circle cx="160" cy="85" r="28" fill="none" stroke="#E5B246" strokeWidth="1" strokeDasharray="2.5 3" opacity="0.8" />
                  <line x1="160" y1="50" x2="160" y2="120" stroke="#FDE047" strokeWidth="1.4" />
                  <line x1="125" y1="85" x2="195" y2="85" stroke="#FDE047" strokeWidth="1.4" />
                  <line x1="135" y1="60" x2="185" y2="110" stroke="#FDE047" strokeWidth="0.8" opacity="0.6" />
                  <line x1="185" y1="60" x2="135" y2="110" stroke="#FDE047" strokeWidth="0.8" opacity="0.6" />
                  <path d="M 160 74 L 165 85 L 160 96 L 155 85 Z" fill="#FFFDF0" />
                  <circle cx="160" cy="85" r="3.5" fill="#FDE047" />
                </g>

                {/* Vimana Spire Tiers */}
                <g>
                  <line x1="160" y1="102" x2="132" y2="165" stroke="#E5B246" strokeWidth="1.8" />
                  <line x1="160" y1="102" x2="188" y2="165" stroke="#E5B246" strokeWidth="1.8" />
                  <line x1="150" y1="122" x2="170" y2="122" stroke="#E5B246" strokeWidth="1.2" />
                  <line x1="143" y1="137" x2="177" y2="137" stroke="#E5B246" strokeWidth="1.2" />
                  <line x1="136" y1="152" x2="184" y2="152" stroke="#E5B246" strokeWidth="1.2" />
                </g>

                {/* Sacred Vimana Dome Outline */}
                <motion.path
                  d="M 132 165 C 98 180 82 212 82 250 C 82 288 116 316 160 316 C 204 316 238 288 238 250 C 238 212 222 180 188 165 Z"
                  fill="none"
                  stroke="#E5B246"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: SMOOTH_EASE }}
                />

                {/* Decorative Dotted Curves Inside Dome */}
                <path d="M 108 268 Q 160 286 212 268" fill="none" stroke="#E5B246" strokeWidth="1.2" strokeDasharray="2.5 3.5" opacity="0.8" />
                <path d="M 116 282 Q 160 296 204 282" fill="none" stroke="#E5B246" strokeWidth="1.2" strokeDasharray="2.5 3.5" opacity="0.8" />

                {/* Central White Tirumala Namam U-Pillars */}
                <g style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' }}>
                  <path d="M 142 182 L 149 182 C 151 206 153 224 156 232 C 154 234 150 234 147 231 C 143 221 141 202 142 182 Z" fill="#FFFFFF" />
                  <path d="M 178 182 L 171 182 C 169 206 167 224 164 232 C 166 234 170 234 173 231 C 177 221 179 202 178 182 Z" fill="#FFFFFF" />
                </g>

                {/* Central Red Kasturi Tilak Spindle */}
                <motion.path
                  d="M 160 176 C 161.8 194 162.8 212 162.8 225 C 162.8 233 161.2 238 160 239 C 158.8 238 157.2 233 157.2 225 C 157.2 212 158.2 194 160 176 Z"
                  fill="#E52E2E"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(229, 46, 46, 0.9))', transformOrigin: '160px 176px' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: SMOOTH_EASE }}
                />

                {/* Left Shankha & Right Chakra Vector Symbols */}
                <g opacity="0.9">
                  <circle cx="114" cy="196" r="7.5" fill="none" stroke="#E5B246" strokeWidth="1.4" />
                  <line x1="114" y1="188" x2="114" y2="204" stroke="#E5B246" strokeWidth="1" />
                  <line x1="106" y1="196" x2="122" y2="196" stroke="#E5B246" strokeWidth="1" />
                  
                  <circle cx="206" cy="196" r="7.5" fill="none" stroke="#E5B246" strokeWidth="1.4" />
                  <line x1="206" y1="188" x2="206" y2="204" stroke="#E5B246" strokeWidth="1" />
                  <line x1="198" y1="196" x2="214" y2="196" stroke="#E5B246" strokeWidth="1" />
                </g>

                {/* Outer Flanking Dotted Circles */}
                <circle cx="98" cy="226" r="7" fill="none" stroke="#E5B246" strokeWidth="1" strokeDasharray="2 2" opacity="0.75" />
                <circle cx="222" cy="226" r="7" fill="none" stroke="#E5B246" strokeWidth="1" strokeDasharray="2 2" opacity="0.75" />

                {/* Base Diamond Dot */}
                <path d="M 160 274 L 166 282 L 160 290 L 154 282 Z" fill="#FDE047" />
              </svg>
            </motion.div>

            {/* Wordmark: Saarthi Guide */}
            <motion.h1
              style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: 'clamp(30px, 7vw, 42px)',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.14em',
                margin: '0 0 6px 0',
                lineHeight: 1.15
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: SMOOTH_EASE }}
            >
              Saarthi Guide
            </motion.h1>

            {/* Subtitle: Spiritual Pilgrim Companion */}
            <motion.div
              style={{
                fontSize: 'clamp(12px, 3.2vw, 14px)',
                fontWeight: 600,
                color: '#E5B246',
                letterSpacing: '0.08em',
                margin: '0 0 16px 0'
              }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: SMOOTH_EASE }}
            >
              Spiritual Pilgrim Companion
            </motion.div>

            {/* Sacred Lotus Emblem & Dots */}
            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                color: '#E5B246',
                fontSize: '11px',
                opacity: 0.85
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span>•</span>
              <span style={{ fontSize: '13px' }}>🪷</span>
              <span>•</span>
            </motion.div>
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