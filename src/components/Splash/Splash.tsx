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

    // 🎵 Attempt immediate sacred OM chant playback on load
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
    }, 60);

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
          {/* 🌌 Atmospheric Sanctum Background */}
          <div className={styles.sanctumVignette} />

          {/* 🌟 Radiant Golden Sanctum Aura Glow */}
          <motion.div
            className={styles.centralGoldenAura}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.9, scale: 1.05 }}
            transition={{ duration: 1.4, ease: SMOOTH_EASE }}
          />

          {/* 🛕 100% PURE VECTOR CANVAS (First-Principle Sacred Iconography) */}
          <div className={styles.vectorCanvasWrapper}>
            <svg
              viewBox="0 0 380 440"
              className={styles.svgCanvas}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Master Sanctum Radial Aura */}
                <radialGradient id="masterSanctumAura" cx="50%" cy="38%" r="48%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.55" />
                  <stop offset="30%" stopColor="#D97706" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#B45309" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#05130D" stopOpacity="0" />
                </radialGradient>

                {/* Master Sacred Gold Gradient */}
                <linearGradient id="divineGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="25%" stopColor="#FDE68A" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>

                {/* Brilliant Golden Rim Highlight */}
                <linearGradient id="goldRimGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="30%" stopColor="#FEF08A" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>

                {/* Sacred Srichoornam Tilak Crimson Ruby */}
                <linearGradient id="srichoornamRed" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FCA5A5" />
                  <stop offset="20%" stopColor="#EF4444" />
                  <stop offset="65%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#991B1B" />
                </linearGradient>

                {/* Pristine Pure White Pearl Gradient for Thiruman */}
                <linearGradient id="pearlWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="45%" stopColor="#F8FAFC" />
                  <stop offset="85%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>

                {/* Subtle Sacred Sanctum Glow Filter */}
                <filter id="sanctumGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 🌟 LAYER 1: SANCTUM HALO & CELESTIAL PRANAVA ॐ (0.0s – 1.0s) */}
              <motion.g
                id="background-halo"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '190px 150px' }}
              >
                {/* Aura circles */}
                <circle cx="190" cy="150" r="135" fill="url(#masterSanctumAura)" />
                <circle cx="190" cy="150" r="120" stroke="url(#divineGoldGrad)" strokeWidth="0.8" strokeDasharray="3 4" fill="none" opacity="0.38" />
                <circle cx="190" cy="150" r="85" stroke="url(#divineGoldGrad)" strokeWidth="0.6" strokeDasharray="2 3" fill="none" opacity="0.28" />

                {/* 12 Radiating Celestial Sunburst Light Filaments */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={deg}
                    x1="190"
                    y1="150"
                    x2={190 + 130 * Math.cos((deg * Math.PI) / 180)}
                    y2={150 + 130 * Math.sin((deg * Math.PI) / 180)}
                    stroke="url(#divineGoldGrad)"
                    strokeWidth="0.75"
                    strokeDasharray="4 6"
                    opacity="0.25"
                  />
                ))}

                {/* ॐ (Sacred Pranava Om) Glowing Crown Watermark */}
                <text
                  x="190"
                  y="74"
                  textAnchor="middle"
                  fontFamily="'Cinzel', Georgia, serif"
                  fontSize="28"
                  fontWeight="700"
                  fill="url(#goldRimGlow)"
                  opacity="0.88"
                  letterSpacing="0.05em"
                >
                  ॐ
                </text>
              </motion.g>

              {/* 🛕 LAYER 2: THE SACRED TIRUMALA HOLY TRIO & LOTUS (0.2s – 1.4s) */}
              <motion.g
                id="sacred-holy-emblem"
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1.1, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '190px 160px' }}
                className={styles.sacredEmblemGroup}
              >
                {/* 🪷 Left: Sri Panchajanya Shankha (Sacred Conch Shell) */}
                <g id="sacred-shankha">
                  {/* Golden flame plume on top */}
                  <path d="M 92 108 C 88 96, 96 86, 92 78 C 87 86, 83 92, 85 102 Z" fill="url(#goldRimGlow)" />
                  {/* Pearlescent conch body */}
                  <path
                    d="M 94 110 C 74 116, 62 136, 68 156 C 74 174, 96 176, 108 166 C 116 156, 115 132, 102 122 Z"
                    fill="url(#pearlWhite)"
                    stroke="url(#divineGoldGrad)"
                    strokeWidth="1.3"
                  />
                  {/* Sacred spiral grooves */}
                  <path d="M 76 138 Q 90 144 104 134" stroke="url(#divineGoldGrad)" strokeWidth="1.2" fill="none" opacity="0.85" />
                  <path d="M 72 150 Q 90 156 106 148" stroke="url(#divineGoldGrad)" strokeWidth="1.2" fill="none" opacity="0.85" />
                  <path d="M 80 162 Q 92 166 102 160" stroke="url(#divineGoldGrad)" strokeWidth="1.0" fill="none" opacity="0.75" />
                  <circle cx="92" cy="110" r="2.2" fill="#FDE68A" />
                </g>

                {/* ☸️ Right: Sri Sudarshana Chakra (Sacred Discus) */}
                <g id="sacred-chakra">
                  {/* Golden flame plume on top */}
                  <path d="M 288 108 C 284 96, 292 86, 288 78 C 283 86, 279 92, 281 102 Z" fill="url(#goldRimGlow)" />
                  {/* Double outer rims */}
                  <circle cx="288" cy="142" r="28" stroke="url(#divineGoldGrad)" strokeWidth="2.2" fill="none" />
                  <circle cx="288" cy="142" r="23" stroke="url(#goldRimGlow)" strokeWidth="0.9" strokeDasharray="3 3" fill="none" opacity="0.85" />
                  {/* Center diamond hub */}
                  <circle cx="288" cy="142" r="8" fill="url(#divineGoldGrad)" />
                  <circle cx="288" cy="142" r="3.5" fill="#FFFFFF" />
                  {/* 8 Cardinal & Diagonal Spokes */}
                  <path
                    d="
                      M 288 114 L 288 170
                      M 260 142 L 316 142
                      M 268 122 L 308 162
                      M 268 162 L 308 122
                    "
                    stroke="url(#divineGoldGrad)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  {/* Discus Flame Teeth at Cardinal Edges */}
                  <circle cx="288" cy="114" r="2.2" fill="#FDE68A" />
                  <circle cx="288" cy="170" r="2.2" fill="#FDE68A" />
                  <circle cx="260" cy="142" r="2.2" fill="#FDE68A" />
                  <circle cx="316" cy="142" r="2.2" fill="#FDE68A" />
                </g>

                {/* 🛕 Center: Sri Tirumala Sacred Namam (Thiruman & Srichoornam) */}
                <g id="sacred-tirunamam" filter="url(#sanctumGlow)">
                  {/* Left White Arm (Thiruman) */}
                  <path
                    d="
                      M 160 98 
                      C 166 128, 172 166, 178 198 
                      L 188 198 
                      C 182 166, 175 128, 169 98 Z
                    "
                    fill="url(#pearlWhite)"
                    stroke="url(#divineGoldGrad)"
                    strokeWidth="0.8"
                  />

                  {/* Right White Arm (Thiruman) */}
                  <path
                    d="
                      M 220 98 
                      C 214 128, 208 166, 202 198 
                      L 192 198 
                      C 198 166, 205 128, 211 98 Z
                    "
                    fill="url(#pearlWhite)"
                    stroke="url(#divineGoldGrad)"
                    strokeWidth="0.8"
                  />

                  {/* Connecting White Base (U-Pedestal) */}
                  <path
                    d="
                      M 178 198 
                      Q 190 216 202 198 
                      Q 190 224 178 198 Z
                    "
                    fill="url(#pearlWhite)"
                    stroke="url(#divineGoldGrad)"
                    strokeWidth="0.8"
                  />

                  {/* Central Sacred Vermilion Srichoornam Tilakam */}
                  <path
                    d="
                      M 186 102 
                      L 194 102 
                      L 193 206 
                      Q 190 214 187 206 Z
                    "
                    fill="url(#srichoornamRed)"
                  />
                  {/* Radiant Golden Diamond Crown on Tilakam */}
                  <polygon points="190,92 194,98 190,104 186,98" fill="url(#goldRimGlow)" />
                  <circle cx="190" cy="98" r="1.5" fill="#FFFFFF" />
                </g>

                {/* 🌸 Sacred Golden Lotus Base (Padma Peetham) */}
                <g id="sacred-lotus-base">
                  {/* Center Petal */}
                  <path d="M 190 200 Q 196 214 190 226 Q 184 214 190 200 Z" fill="url(#goldRimGlow)" />
                  {/* Inner Flanking Petals */}
                  <path d="M 190 226 Q 174 218 178 206 Q 185 216 190 226 Z" fill="url(#divineGoldGrad)" />
                  <path d="M 190 226 Q 206 218 202 206 Q 195 216 190 226 Z" fill="url(#divineGoldGrad)" />
                  {/* Outer Flanking Petals */}
                  <path d="M 190 226 Q 158 222 165 212 Q 178 220 190 226 Z" fill="url(#divineGoldGrad)" />
                  <path d="M 190 226 Q 222 222 215 212 Q 202 220 190 226 Z" fill="url(#divineGoldGrad)" />
                  {/* Wide Base Petals */}
                  <path d="M 190 226 Q 142 228 150 220 Q 170 224 190 226 Z" fill="url(#goldRimGlow)" opacity="0.8" />
                  <path d="M 190 226 Q 238 228 230 220 Q 210 224 190 226 Z" fill="url(#goldRimGlow)" opacity="0.8" />
                  {/* Lotus Foundation Golden Line */}
                  <line x1="130" y1="232" x2="250" y2="232" stroke="url(#divineGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="130" cy="232" r="2.2" fill="#F59E0B" />
                  <circle cx="250" cy="232" r="2.2" fill="#F59E0B" />
                </g>
              </motion.g>

              {/* 📜 LAYER 3: MASTER BRAND TYPOGRAPHY & BLESSING (0.65s – 1.6s) */}
              <motion.g
                id="brand-typography-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.9, ease: SMOOTH_EASE }}
              >
                {/* Main Regal Wordmark */}
                <text
                  x="190"
                  y="294"
                  textAnchor="middle"
                  fill="#FFFDF8"
                  fontSize="34"
                  fontWeight="700"
                  fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
                  letterSpacing="0.22em"
                  className={styles.brandTitleText}
                >
                  SAARTHI
                </text>

                {/* Telugu Sacred Name */}
                <text
                  x="190"
                  y="326"
                  textAnchor="middle"
                  fill="#FDE68A"
                  fontSize="17.5"
                  fontWeight="700"
                  fontFamily="'Noto Sans Telugu', system-ui, sans-serif"
                  letterSpacing="0.12em"
                >
                  సారథి
                </text>

                {/* Clean Purpose Subtitle */}
                <text
                  x="190"
                  y="354"
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="9.8"
                  fontWeight="600"
                  fontFamily="'Inter', system-ui, sans-serif"
                  letterSpacing="0.24em"
                  opacity="0.88"
                >
                  YOUR DIVINE TIRUPATI COMPANION
                </text>

                {/* Sacred Devotional Blessing Mantra */}
                <text
                  x="190"
                  y="384"
                  textAnchor="middle"
                  fill="#F59E0B"
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="'Noto Sans Telugu', system-ui, sans-serif"
                  letterSpacing="0.06em"
                  opacity="0.95"
                >
                  || ఓం నమో వేంకటేశాయ ||
                </text>

                {/* Decorative Bottom Divider Filament */}
                <line
                  x1="120"
                  y1="406"
                  x2="260"
                  y2="406"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                  opacity="0.4"
                />
                <circle cx="190" cy="406" r="2.2" fill="#F59E0B" />
              </motion.g>
            </svg>
          </div>

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
              <span className={styles.soundPromptEnglish}>Tap for OM ॐ</span>
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
              <span>ప్రణవ నాదం ॐ • OM Soundscape</span>
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
