'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTempleBellChime } from '@/lib/audioBell';
import styles from './Splash.module.css';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
    setTimeout(onFinish, 350); // 350ms smooth exit cross-fade
  }, [onFinish]);

  useEffect(() => {
    // 🔔 Sacred bronze temple chime (0.2s)
    const soundTimer = setTimeout(() => {
      playTempleBellChime();
    }, 200);

    // ⏱️ Fast, smooth choreographed sequence: 2.2s animation + 0.3s hold = 2.5s
    const splashTimer = setTimeout(() => {
      handleFinish();
    }, 2500);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(splashTimer);
    };
  }, [handleFinish]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={styles.splashContainer}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          onClick={handleFinish}
        >
          {/* 🌌 Phase 1: Deep Sanctum Ambient Vignette */}
          <div className={styles.sanctumVignette} />

          {/* 🌟 Phase 2: Layered Golden Sanctum Aura */}
          <motion.div
            className={styles.centralGoldenAura}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.6, 0.8, 0.7], 
              scale: [0.8, 1.02, 1.05] 
            }}
            transition={{ 
              duration: 1.8, 
              ease: "easeOut" 
            }}
          />

          {/* 🛕 100% PURE VECTOR CANVAS */}
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

              {/* 🌟 1. BACKGROUND SANCTUM HALO & CELESTIAL ORBIT CIRCLE */}
              <motion.circle
                cx="200"
                cy="210"
                r="155"
                fill="url(#masterSanctumAura)"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              />

              {/* Fine Outer Celestial Compass Orbit Ring */}
              <motion.circle
                cx="200"
                cy="205"
                r="142"
                stroke="url(#divineGoldGrad)"
                strokeWidth="0.8"
                strokeDasharray="4 4"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              />

              {/* ✦ 2. SACRED GEOMETRY SAARTHI MANDALA */}
              <g id="sacred-mandala">
                {/* Outer Golden Concentric Ring */}
                <motion.circle
                  cx="200"
                  cy="54"
                  r="30"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.3"
                  fill="none"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                  style={{ transformOrigin: '200px 54px' }}
                />
                <motion.circle
                  cx="200"
                  cy="54"
                  r="20"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="0.9"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                />
                <motion.circle
                  cx="200"
                  cy="54"
                  r="10"
                  stroke="url(#goldRimGlow)"
                  strokeWidth="0.7"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                />

                {/* 8 Intersecting Sacred Flower-of-Life Arcs */}
                <motion.path
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.85, scale: 1 }}
                  transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                  style={{ transformOrigin: '200px 54px' }}
                />

                {/* Cardinal Radial Axis Rays */}
                <motion.path
                  d="M 200 18 L 200 90 M 164 54 L 236 54"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                />

                {/* Center Brilliant Diamond Star Burst */}
                <motion.polygon
                  points="200,40 203.5,54 218,54 203.5,56.5 200,70 196.5,56.5 182,54 196.5,54"
                  fill="url(#goldRimGlow)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.4, ease: "easeOut" }}
                  style={{ transformOrigin: '200px 54px' }}
                />
                <circle cx="200" cy="54" r="2.8" fill="#FFFFFF" />
              </g>

              {/* 👑 3. LORD VENKATESWARA SWAMY MAJESTIC SILHOUETTE */}
              <g id="divine-deity-form">
                {/* Solid Midnight Silhouette Base */}
                <motion.path
                  d="
                    M 200 88
                    L 204 100 L 208 118 L 214 140 L 221 164 L 228 190
                    L 236 198 L 246 206 L 254 214 L 262 224 L 268 232
                    L 276 244 L 284 260 L 288 280 L 286 306 L 280 330
                    L 120 330 L 114 306 L 112 280 L 116 260 L 124 244
                    L 132 232 L 138 224 L 146 214 L 154 206 L 164 198
                    L 172 190 L 179 164 L 186 140 L 192 118 L 196 100 Z
                  "
                  fill="#010A07"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                />

                {/* ── TOWERING RAJA KIREETAM (CROWN) ARCHITECTURE ── */}
                {/* 1. Crown Pinnacle Kalasam Spire */}
                <motion.path
                  d="
                    M 200 88 L 203.5 96 L 207 106 L 193 106 L 196.5 96 Z
                    M 200 84 L 202 88 L 198 88 Z
                  "
                  fill="url(#goldRimGlow)"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                />

                {/* 2. Stepped Gopuram Tiers with Golden Contours */}
                <motion.path
                  d="
                    M 193 106 C 195 116, 198 126, 200 130 C 202 126, 205 116, 207 106
                    M 190 120 Q 200 115 210 120
                    M 186 134 Q 200 129 214 134
                    M 182 150 Q 200 144 218 150
                    M 178 168 Q 200 161 222 168
                    M 174 188 Q 200 180 226 188
                  "
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.95 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                />

                {/* Crown Outer Ridge Flares (Rim Lighting) */}
                <motion.path
                  d="
                    M 200 88
                    C 205 108, 212 134, 218 160
                    C 223 176, 227 188, 230 196
                    M 200 88
                    C 195 108, 188 134, 182 160
                    C 177 176, 173 188, 170 196
                  "
                  stroke="url(#goldRimGlow)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />

                {/* Crown Inner Pointed Arch Tracery Panel */}
                <motion.path
                  d="
                    M 196 148 Q 200 142 204 148
                    M 194 164 Q 200 156 206 164
                    M 191 182 Q 200 172 209 182
                    M 197 132 L 200 126 L 203 132
                  "
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.3"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                />

                {/* ── MAKARA KUNDALAMS (ORNATE HANGING EARRINGS) ── */}
                {/* Left Earring */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
                  <circle cx="156" cy="220" r="8.5" stroke="url(#divineGoldGrad)" strokeWidth="1.5" fill="none" />
                  <circle cx="156" cy="220" r="5" stroke="url(#goldRimGlow)" strokeWidth="1" fill="none" />
                  <circle cx="156" cy="220" r="2.2" fill="#FDE68A" />
                  <path d="M 156 228.5 L 156 240 M 153 240 L 159 240" stroke="url(#divineGoldGrad)" strokeWidth="1.3" strokeLinecap="round" />
                </motion.g>

                {/* Right Earring */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
                  <circle cx="244" cy="220" r="8.5" stroke="url(#divineGoldGrad)" strokeWidth="1.5" fill="none" />
                  <circle cx="244" cy="220" r="5" stroke="url(#goldRimGlow)" strokeWidth="1" fill="none" />
                  <circle cx="244" cy="220" r="2.2" fill="#FDE68A" />
                  <path d="M 244 228.5 L 244 240 M 241 240 L 247 240" stroke="url(#divineGoldGrad)" strokeWidth="1.3" strokeLinecap="round" />
                </motion.g>

                {/* ── SHOULDER FINIALS / KALASAMS (BHUJAKIRTI) ── */}
                {/* Left Shoulder Kalasam */}
                <motion.path
                  d="
                    M 132 232 L 136 222 L 140 232 Z
                    M 136 218 L 136 222
                    M 128 236 Q 136 232 144 236
                  "
                  stroke="url(#goldRimGlow)"
                  strokeWidth="1.4"
                  fill="url(#divineGoldGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                />

                {/* Right Shoulder Kalasam */}
                <motion.path
                  d="
                    M 260 232 L 264 222 L 268 232 Z
                    M 264 218 L 264 222
                    M 256 236 Q 264 232 272 236
                  "
                  stroke="url(#goldRimGlow)"
                  strokeWidth="1.4"
                  fill="url(#divineGoldGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                />

                {/* Broad Shoulder Armor Arcs */}
                <motion.path
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
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.95 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                />

                {/* Shoulder Medallion Mandalas */}
                <circle cx="138" cy="266" r="10" stroke="url(#divineGoldGrad)" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity="0.8" />
                <circle cx="262" cy="266" r="10" stroke="url(#divineGoldGrad)" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity="0.8" />

                {/* 🪷 4. RADIANT TIRUMALA NAMAM (Focal Light) */}
                <g id="sacred-namam">
                  {/* Left Pure White U-Arm */}
                  <motion.path
                    d="
                      M 183 198 
                      C 186 214, 190 230, 193.5 240 
                      L 198 240 
                      C 195 230, 191 214, 189 198 Z
                    "
                    fill="#FFFFFF"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.75, duration: 0.45, ease: "easeOut" }}
                    style={{ transformOrigin: '190px 240px' }}
                  />

                  {/* Right Pure White U-Arm */}
                  <motion.path
                    d="
                      M 217 198 
                      C 214 214, 210 230, 206.5 240 
                      L 202 240 
                      C 205 230, 209 214, 211 198 Z
                    "
                    fill="#FFFFFF"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.75, duration: 0.45, ease: "easeOut" }}
                    style={{ transformOrigin: '210px 240px' }}
                  />

                  {/* Connecting Curved Base */}
                  <motion.path
                    d="M 193.5 240 Q 200 248 206.5 240 Q 200 252 193.5 240 Z"
                    fill="#FFFFFF"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.85, duration: 0.3 }}
                  />

                  {/* Central Radiant Vermilion Srichoornam Tilakam */}
                  <motion.path
                    d="M 198.5 200 L 201.5 200 L 201.5 246 Q 200 250 198.5 246 Z"
                    fill="url(#srichoornamRed)"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
                    style={{ transformOrigin: '200px 200px' }}
                  />
                </g>

                {/* Chest Necklaces */}
                <motion.path
                  d="
                    M 166 260 Q 200 274 234 260
                    M 158 278 Q 200 296 242 278
                    M 150 298 Q 200 320 250 298
                  "
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.3"
                  strokeDasharray="3 3"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  transition={{ delay: 0.85, duration: 0.4 }}
                />

                {/* Central Jeweled Pendant */}
                <motion.polygon
                  points="200,290 206,299 200,308 194,299"
                  fill="url(#goldRimGlow)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                  style={{ transformOrigin: '200px 299px' }}
                />
              </g>

              {/* 📜 5. MASTER BRAND TYPOGRAPHY */}
              <g id="typography">
                {/* Saarthi Wordmark */}
                <motion.text
                  x="200"
                  y="370"
                  textAnchor="middle"
                  fill="#FFFDF8"
                  fontSize="38"
                  fontWeight="600"
                  fontFamily="Cinzel, 'Playfair Display', Georgia, serif"
                  letterSpacing="0.18em"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.5, ease: "easeOut" }}
                >
                  Saarthi Guide
                </motion.text>

                {/* Subtitle / Tagline */}
                <motion.text
                  x="200"
                  y="400"
                  textAnchor="middle"
                  fill="#F59E0B"
                  fontSize="11.5"
                  fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                  letterSpacing="0.22em"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.95, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.4, ease: "easeOut" }}
                >
                  Spiritual Pilgrim Companion
                </motion.text>
              </g>

              {/* 🪷 6. SACRED LOTUS & GOLDEN EMBLEM BEAM */}
              <g id="lotus-beam">
                {/* Left Golden Hairline */}
                <motion.line
                  x1="95"
                  y1="428"
                  x2="182"
                  y2="428"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.15, duration: 0.4, ease: "easeOut" }}
                  style={{ transformOrigin: '182px 428px' }}
                />
                <circle cx="95" cy="428" r="2.2" fill="#F59E0B" />

                {/* Central Sacred Lotus Flower */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.35, ease: "easeOut" }}
                  style={{ transformOrigin: '200px 422px' }}
                >
                  <path d="M 200 416 Q 204.5 423 200 428 Q 195.5 423 200 416 Z" fill="url(#goldRimGlow)" />
                  <path d="M 200 428 Q 189 424 192 418 Q 196.5 422 200 428 Z" fill="url(#divineGoldGrad)" />
                  <path d="M 200 428 Q 211 424 208 418 Q 203.5 422 200 428 Z" fill="url(#divineGoldGrad)" />
                </motion.g>

                {/* Right Golden Hairline */}
                <motion.line
                  x1="218"
                  y1="428"
                  x2="305"
                  y2="428"
                  stroke="url(#divineGoldGrad)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.15, duration: 0.4, ease: "easeOut" }}
                  style={{ transformOrigin: '218px 428px' }}
                />
                <circle cx="305" cy="428" r="2.2" fill="#F59E0B" />
              </g>
            </svg>
          </div>

          {/* ⚡ Skip button */}
          <motion.button
            className={styles.skipPill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
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
