'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSaarthiSonicIdent, stopSaarthiSonicIdent } from '@/lib/audioIdentity';
import styles from './Splash.module.css';

// Silky smooth spring-like deceleration curve (First Principle motion curve)
const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleFinish = useCallback(() => {
    stopSaarthiSonicIdent();
    setIsVisible(false);
  }, []);

  useEffect(() => {
    // 🎵 Saarthi "Divine Journey" signature sonic ident (Tanpura -> Bansuri -> Veena -> Om swell)
    const soundTimer = setTimeout(() => {
      playSaarthiSonicIdent();
    }, 60);

    // ⏱️ Total viewing duration: ~6.8s divine journey matching the 7.0s opening ident
    const splashTimer = setTimeout(() => {
      handleFinish();
    }, 6800);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(splashTimer);
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
          onClick={handleFinish}
        >
          {/* 🌌 Phase 1: Deep Sanctum Ambient Vignette */}
          <div className={styles.sanctumVignette} />

          {/* 🌟 Phase 2: Layered Golden Sanctum Aura */}
          <motion.div
            className={styles.centralGoldenAura}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ duration: 2.0, ease: SMOOTH_EASE }}
          />

          {/* 🛕 100% PURE VECTOR CANVAS (Grouped Hardware-Accelerated SVG) */}
          <div className={styles.vectorCanvasWrapper}>
            <svg
              viewBox="0 0 400 480"
              className={styles.svgCanvas}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 🌟 Divine Sanctum Golden Halo */}
                <radialGradient id="masterSanctumAura" cx="50%" cy="44%" r="46%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.65" />
                  <stop offset="25%" stopColor="#D97706" stopOpacity="0.45" />
                  <stop offset="55%" stopColor="#B45309" stopOpacity="0.18" />
                  <stop offset="80%" stopColor="#0A241C" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#061813" stopOpacity="0" />
                </radialGradient>

                {/* Master Sacred Gold Gradient */}
                <linearGradient id="divineGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="20%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="80%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>

                {/* Brilliant Golden Rim Highlight */}
                <linearGradient id="goldRimGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#FEF08A" />
                  <stop offset="65%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>

                {/* Sacred Srichoornam Tilak Red */}
                <linearGradient id="srichoornamRed" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="45%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#991B1B" />
                </linearGradient>
              </defs>

              {/* 🌟 LAYER 1: SANCTUM HALO & CELESTIAL ORBIT CIRCLE (0.0s – 1.4s | Tanpura Drone) */}
              <motion.g
                id="background-halo"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '200px 210px' }}
              >
                <circle
                  cx="200"
                  cy="210"
                  r="155"
                  fill="url(#masterSanctumAura)"
                />
                <circle
                  cx="200"
                  cy="205"
                  r="142"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  fill="none"
                  opacity="0.45"
                />
              </motion.g>

              {/* ✦ LAYER 2: SACRED GEOMETRY SAARTHI MANDALA (0.2s – 1.5s) */}
              <motion.g
                id="sacred-mandala"
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 1.1, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '200px 54px' }}
              >
                {/* Concentric rings */}
                <circle
                  cx="200"
                  cy="54"
                  r="30"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.3"
                  fill="none"
                  opacity="0.95"
                />
                <circle
                  cx="200"
                  cy="54"
                  r="20"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="0.9"
                  fill="none"
                  opacity="0.8"
                />
                <circle
                  cx="200"
                  cy="54"
                  r="10"
                  stroke="url(#goldRimGlow)"
                  strokeWidth="0.7"
                  fill="none"
                  opacity="0.7"
                />

                {/* 8 Intersecting Sacred Flower-of-Life Arcs */}
                <path
                  d="
                    M 200 24 Q 220 44 200 64 Q 180 44 200 24
                    M 200 44 Q 220 64 200 84 Q 180 64 200 44
                    M 170 54 Q 190 74 210 54 Q 190 34 170 54
                    M 190 54 Q 210 74 230 54 Q 210 34 190 54
                    M 179 33 Q 200 54 221 75
                    M 179 75 Q 200 54 221 33
                  "
                  stroke="url(#goldRimGlow)"
                  strokeWidth="0.9"
                  fill="none"
                  opacity="0.85"
                />

                {/* Cardinal Radial Axis Rays */}
                <path
                  d="M 200 18 L 200 90 M 164 54 L 236 54"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  opacity="0.9"
                />

                {/* Center Brilliant Diamond Star Burst */}
                <polygon
                  points="200,40 203.5,54 218,54 203.5,56.5 200,70 196.5,56.5 182,54 196.5,54"
                  fill="url(#goldRimGlow)"
                />
                <circle cx="200" cy="54" r="2.8" fill="#FFFFFF" />
              </motion.g>

              {/* 👑 LAYER 3: LORD VENKATESWARA SWAMY MAJESTIC SILHOUETTE (1.35s – 2.8s | Bamboo Flute Motif) */}
              <motion.g
                id="divine-deity-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.35, duration: 1.1, ease: SMOOTH_EASE }}
              >
                {/* 1. Crown Pinnacle Kalasam Spire */}
                <path
                  d="
                    M 200 88 L 203.5 96 L 207 106 L 193 106 L 196.5 96 Z
                    M 200 84 L 202 88 L 198 88 Z
                  "
                  fill="url(#goldRimGlow)"
                />

                {/* 2. Stepped Gopuram Tiers with Golden Contours */}
                <path
                  d="
                    M 193 106 C 195 116, 198 126, 200 130 C 202 126, 205 116, 207 106
                    M 190 120 Q 200 115 210 120
                    M 186 134 Q 200 129 214 134
                    M 182 150 Q 200 144 218 150
                    M 178 168 Q 200 161 222 168
                    M 174 188 Q 200 180 226 188
                  "
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.95"
                />

                {/* Crown Outer Ridge Flares */}
                <path
                  d="
                    M 200 88
                    C 205 108, 212 134, 218 160
                    C 223 176, 227 188, 230 196
                    M 200 88
                    C 195 108, 188 134, 182 160
                    C 177 176, 173 188, 170 196
                  "
                  stroke="url(#goldRimGlow)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Crown Inner Pointed Arch Tracery Panel */}
                <path
                  d="
                    M 196 148 Q 200 142 204 148
                    M 194 164 Q 200 156 206 164
                    M 191 182 Q 200 172 209 182
                    M 197 132 L 200 126 L 203 132
                  "
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.4"
                  fill="none"
                  opacity="0.85"
                />

                {/* Makara Kundalams (Earrings) */}
                <g id="earrings">
                  {/* Left */}
                  <circle cx="156" cy="220" r="8.5" stroke="url(#divineGoldGrad)" strokeWidth="1.6" fill="none" />
                  <circle cx="156" cy="220" r="5" stroke="url(#goldRimGlow)" strokeWidth="1.2" fill="none" />
                  <circle cx="156" cy="220" r="2.5" fill="#FDE68A" />
                  <path d="M 156 228.5 L 156 240 M 153 240 L 159 240" stroke="url(#divineGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Right */}
                  <circle cx="244" cy="220" r="8.5" stroke="url(#divineGoldGrad)" strokeWidth="1.6" fill="none" />
                  <circle cx="244" cy="220" r="5" stroke="url(#goldRimGlow)" strokeWidth="1.2" fill="none" />
                  <circle cx="244" cy="220" r="2.5" fill="#FDE68A" />
                  <path d="M 244 228.5 L 244 240 M 241 240 L 247 240" stroke="url(#divineGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Shoulder Finials / Kalasams */}
                <path
                  d="
                    M 132 232 L 136 222 L 140 232 Z
                    M 136 218 L 136 222
                    M 128 236 Q 136 232 144 236
                  "
                  stroke="url(#goldRimGlow)"
                  strokeWidth="1.5"
                  fill="url(#divineGoldGrad)"
                />
                <path
                  d="
                    M 260 232 L 264 222 L 268 232 Z
                    M 264 218 L 264 222
                    M 256 236 Q 264 232 272 236
                  "
                  stroke="url(#goldRimGlow)"
                  strokeWidth="1.5"
                  fill="url(#divineGoldGrad)"
                />

                {/* Shoulder Armor Arcs (Bhujakirti Contours) */}
                <path
                  d="
                    M 166 204
                    C 148 208, 134 222, 126 240
                    C 118 260, 116 282, 120 306
                    C 124 320, 132 328, 142 334
                    M 234 204
                    C 252 208, 266 222, 274 240
                    C 282 260, 284 282, 280 306
                    C 276 320, 268 328, 258 334
                  "
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.95"
                />

                {/* Shoulder Medallions */}
                <circle cx="138" cy="266" r="10" stroke="url(#divineGoldGrad)" strokeWidth="1.3" strokeDasharray="3 2" fill="none" opacity="0.85" />
                <circle cx="262" cy="266" r="10" stroke="url(#divineGoldGrad)" strokeWidth="1.3" strokeDasharray="3 2" fill="none" opacity="0.85" />

                {/* Chest Necklaces */}
                <path
                  d="
                    M 166 260 Q 200 274 234 260
                    M 158 278 Q 200 296 242 278
                    M 150 298 Q 200 320 250 298
                  "
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.4"
                  strokeDasharray="3 3"
                  fill="none"
                  opacity="0.8"
                />

                {/* Central Jeweled Pendant */}
                <polygon
                  points="200,290 206,299 200,308 194,299"
                  fill="url(#goldRimGlow)"
                />
              </motion.g>

              {/* 🪷 LAYER 4: RADIANT SACRED TIRUMALA NAMAM (2.95s – 4.2s | Resonant Veena Pluck) */}
              <motion.g
                id="sacred-namam"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.95, duration: 0.9, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '200px 225px' }}
              >
                {/* Left Pure White Shankha/U-Arm */}
                <path
                  d="
                    M 181 194 
                    C 184 212, 189 230, 193 242 
                    L 199 242 
                    C 195 230, 190 212, 187 194 Z
                  "
                  fill="#FFFFFF"
                />

                {/* Right Pure White Chakra/U-Arm */}
                <path
                  d="
                    M 219 194 
                    C 216 212, 211 230, 207 242 
                    L 201 242 
                    C 205 230, 210 212, 213 194 Z
                  "
                  fill="#FFFFFF"
                />

                {/* Connecting White Base */}
                <path
                  d="M 193 242 Q 200 250 207 242 Q 200 254 193 242 Z"
                  fill="#FFFFFF"
                />

                {/* Central Radiant Vermilion Srichoornam Tilakam */}
                <path
                  d="M 198 196 L 202 196 L 202 248 Q 200 252 198 248 Z"
                  fill="url(#srichoornamRed)"
                />
                <circle cx="200" cy="196" r="2" fill="#F87171" />
              </motion.g>

              {/* 📜 LAYER 5: MASTER BRAND TYPOGRAPHY & SACRED LOTUS BEAM (4.1s – 5.8s | Subtle "Om" Swell) */}
              <motion.g
                id="brand-typography-and-lotus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.1, duration: 0.9, ease: SMOOTH_EASE }}
              >
                {/* Saarthi Wordmark */}
                <text
                  x="200"
                  y="370"
                  textAnchor="middle"
                  fill="#FFFDF8"
                  fontSize="38"
                  fontWeight="600"
                  fontFamily="Cinzel, 'Playfair Display', Georgia, serif"
                  letterSpacing="0.18em"
                >
                  Saarthi Guide
                </text>

                {/* Subtitle / Tagline */}
                <text
                  x="200"
                  y="400"
                  textAnchor="middle"
                  fill="#F59E0B"
                  fontSize="11.5"
                  fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                  letterSpacing="0.22em"
                  opacity="0.95"
                >
                  Spiritual Pilgrim Companion
                </text>

                {/* Lotus Beam - Left */}
                <line
                  x1="95"
                  y1="428"
                  x2="182"
                  y2="428"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <circle cx="95" cy="428" r="2.2" fill="#F59E0B" />

                {/* Central Sacred Lotus Flower */}
                <g id="lotus-flower">
                  <path d="M 200 416 Q 204.5 423 200 428 Q 195.5 423 200 416 Z" fill="url(#goldRimGlow)" />
                  <path d="M 200 428 Q 189 424 192 418 Q 196.5 422 200 428 Z" fill="url(#divineGoldGrad)" />
                  <path d="M 200 428 Q 211 424 208 418 Q 203.5 422 200 428 Z" fill="url(#divineGoldGrad)" />
                </g>

                {/* Lotus Beam - Right */}
                <line
                  x1="218"
                  y1="428"
                  x2="305"
                  y2="428"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <circle cx="305" cy="428" r="2.2" fill="#F59E0B" />
              </motion.g>
            </svg>
          </div>

          {/* ⚡ Skip button */}
          <motion.button
            className={styles.skipPill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
          >
            Skip →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
