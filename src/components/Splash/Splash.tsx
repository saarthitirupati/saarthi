'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSaarthiSonicIdent, stopSaarthiSonicIdent } from '@/lib/audioIdentity';
import styles from './Splash.module.css';

// Silky smooth spring-like deceleration curve (First Principle motion curve)
const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  const handleFinish = useCallback(() => {
    stopSaarthiSonicIdent();
    setIsVisible(false);
  }, []);

  const handleStartSound = useCallback(async () => {
    const started = await playSaarthiSonicIdent(true);
    if (started) {
      setIsAudioPlaying(true);
      setIsAutoplayBlocked(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let splashTimer: NodeJS.Timeout;

    // 🎵 Play authentic Tirumala temple soundscape (Shankha + Sanctum Bells + Tanpura + Sacred OM)
    const soundTimer = setTimeout(async () => {
      const started = await playSaarthiSonicIdent();
      if (!isMounted) return;
      if (started) {
        setIsAudioPlaying(true);
        setIsAutoplayBlocked(false);
      } else {
        // Autoplay policy prevented playback until user gesture
        setIsAutoplayBlocked(true);
      }
    }, 50);

    // ⏱️ Pacing from first principles: 3.8s golden window (serene, sacred, zero sluggishness)
    splashTimer = setTimeout(() => {
      if (isMounted) {
        handleFinish();
      }
    }, 3800);

    // 🛡️ Global one-time gesture unlock: touch/tap on screen unlocks sound & enters gracefully
    const handleOneTimeGesture = async () => {
      const started = await playSaarthiSonicIdent(true);
      if (isMounted && started) {
        setIsAudioPlaying(true);
        setIsAutoplayBlocked(false);
      }
    };

    window.addEventListener('pointerdown', handleOneTimeGesture, { once: true });
    window.addEventListener('keydown', handleOneTimeGesture, { once: true });

    return () => {
      isMounted = false;
      clearTimeout(soundTimer);
      clearTimeout(splashTimer);
      window.removeEventListener('pointerdown', handleOneTimeGesture);
      window.removeEventListener('keydown', handleOneTimeGesture);
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
          transition={{ duration: 0.45, ease: SMOOTH_EASE }}
          onClick={() => {
            if (!isAudioPlaying && isAutoplayBlocked) {
              handleStartSound();
            } else {
              handleFinish();
            }
          }}
        >
          {/* 🌌 Deep Sanctum Ambient Atmosphere */}
          <div className={styles.sanctumVignette} />

          {/* 🌟 Radiant Golden Sanctum Aura Glow */}
          <motion.div
            className={styles.centralGoldenAura}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.85, scale: 1.08 }}
            transition={{ duration: 1.4, ease: SMOOTH_EASE }}
          />

          {/* 🛕 MASTER DIVINE ARTWORK (Exact First-Principle Artwork) */}
          <motion.div
            className={styles.artworkWrapper}
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: SMOOTH_EASE }}
          >
            <picture>
              <source srcSet="/assets/splash_divine_master.webp" type="image/webp" />
              <img
                src="/assets/splash_divine_master.jpg"
                alt="Saarthi - Your Divine Tirupati Companion"
                className={styles.masterArtwork}
                loading="eager"
                decoding="sync"
              />
            </picture>
          </motion.div>

          {/* 🔊 Sacred OM Sound Prompt (When browser autoplay requires user gesture) */}
          {isAutoplayBlocked && !isAudioPlaying && (
            <motion.button
              type="button"
              className={styles.soundPromptPill}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: SMOOTH_EASE }}
              onClick={(e) => {
                e.stopPropagation();
                handleStartSound();
              }}
            >
              <span className={styles.pulseDot} />
              <span className={styles.soundPromptTelugu}>దివ్య ప్రణవ నాదం</span>
              <span className={styles.soundPromptDivider}>•</span>
              <span className={styles.soundPromptEnglish}>Tap for Sacred Sound ॐ</span>
            </motion.button>
          )}

          {/* 🎵 Active Divine OM Soundwave Indicator */}
          {isAudioPlaying && (
            <motion.div
              className={styles.soundActivePill}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: SMOOTH_EASE }}
            >
              <span className={styles.soundActiveWave}>
                <span />
                <span />
                <span />
              </span>
              <span>ప్రణవ నాదం ॐ • Sacred Soundscape</span>
            </motion.div>
          )}

          {/* ⚡ Skip button */}
          <motion.button
            className={styles.skipPill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
          >
            Skip →
          </motion.button>

          {/* 🌟 Elegant Bottom Loading Progress Bar */}
          <div className={styles.loadingBarContainer}>
            <div className={styles.loadingBarFill} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
