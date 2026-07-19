'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Splash.module.css';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cinematic animation duration (3.2 seconds total, then exit transition starts)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 700); // 700ms exit transition
    }, 3200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const ambientParticles = Array.from({ length: 22 });
  const titleLetters = Array.from("Saarthi");

  // Framer Motion Staggered Variants for Title Letters
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 1.3
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 90, damping: 14 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={styles.splash}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Dynamic Ambient Blur Lighting Orbs */}
          <motion.div
            style={{
              position: 'absolute',
              width: '380px',
              height: '380px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, transparent 70%)',
              top: '15%',
              left: '5%',
              filter: 'blur(50px)',
              pointerEvents: 'none',
              zIndex: 1
            }}
            animate={{
              x: [0, 25, -15, 0],
              y: [0, -30, 20, 0]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            style={{
              position: 'absolute',
              width: '420px',
              height: '420px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%)',
              bottom: '10%',
              right: '5%',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              zIndex: 1
            }}
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 40, -15, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Drifting Background Lamp Particles */}
          <div className={styles.particleContainer}>
            {ambientParticles.map((_, i) => {
              const xPos = Math.random() * 440 - 220;
              const yPos = Math.random() * 640 - 320;
              return (
                <motion.div
                  key={i}
                  className={styles.particle}
                  initial={{
                    x: xPos,
                    y: yPos,
                    opacity: 0,
                    scale: Math.random() * 0.8 + 0.4
                  }}
                  animate={{
                    y: [yPos, yPos - 90],
                    x: [xPos, xPos + (Math.random() * 30 - 15)],
                    opacity: [0, 0.5, 0.5, 0]
                  }}
                  transition={{
                    duration: 7 + Math.random() * 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 3
                  }}
                />
              );
            })}
          </div>

          {/* Central light emerges (0.3s) */}
          <motion.div
            className={styles.centralLight}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            exit={{ opacity: 0 }}
          />

          {/* Translucent Backdrop Ripples centered on the logo summit (1.2s) */}
          {[0, 1].map((idx) => (
            <motion.div
              key={idx}
              className={styles.ripple}
              style={{ 
                top: 'calc(50% - 130px)', 
                backdropFilter: 'blur(1.5px)', 
                WebkitBackdropFilter: 'blur(1.5px)' 
              }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ 
                width: ['0px', '340px'], 
                height: ['0px', '340px'], 
                opacity: [0, 0.35, 0] 
              }}
              transition={{
                delay: 1.2 + idx * 0.3,
                duration: 1.8,
                ease: "easeOut"
              }}
              exit={{ opacity: 0 }}
            />
          ))}

          {/* Main Content Layout */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            {/* Logo and Landscape Wrapper */}
            <motion.div
              className={styles.logoContainer}
              exit={{ 
                y: -190, 
                scale: 0.26, 
                opacity: 0, 
                transition: { duration: 0.65, ease: [0.25, 1, 0.5, 1] } 
              }}
            >
              {/* Soft Logo Glow (1.2s) */}
              <motion.div
                className={styles.logoGlow}
                style={{ top: 'calc(50% - 60px)' }} // Align with the summit
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.15 }}
                transition={{ delay: 1.2, duration: 0.9, ease: "easeOut" }}
              />

              {/* Advanced Self-Drawing Geometric Lotus-Compass & 7 Hills Logo (0.0s - 2.0s) */}
              <svg viewBox="0 0 200 200" width="200" height="200" style={{ overflow: 'visible', zIndex: 10 }}>
                {/* 1. Seshachalam 7 Hills Silhouette (0.0s - 0.7s) */}
                <motion.path
                  d="M 10 170 Q 38 130 68 152 Q 100 115 132 152 Q 162 125 190 170"
                  stroke="rgba(212, 175, 55, 0.25)"
                  strokeWidth="1.8"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {/* 2. The Winding Pilgrim Path climbing the hills (0.6s - 1.2s) */}
                <motion.path
                  d="M 40 165 C 65 155, 80 135, 100 115 C 115 100, 110 85, 100 70"
                  stroke="rgba(212, 175, 55, 0.45)"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
                />

                {/* 3. Traveler Light Point climbing the path (0.6s - 1.2s) */}
                <motion.circle
                  cx="0" cy="0" r="3.5"
                  fill="#D4AF37"
                  style={{ filter: 'drop-shadow(0 0 4px #D4AF37)' }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: [40, 65, 80, 100, 115, 110, 100],
                    y: [165, 155, 135, 115, 100, 85, 70],
                  }}
                  transition={{
                    delay: 0.6,
                    duration: 0.9,
                    times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0],
                    ease: "easeInOut"
                  }}
                />

                {/* 4. Blooming Guide Star & Lotus Logo at the Summit (1.2s - 2.0s) */}
                {/* Outer Ring */}
                <motion.circle
                  cx="100"
                  cy="70"
                  r="28"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8, ease: "easeInOut" }}
                />

                {/* Outer Ring Compass Ticks */}
                <motion.path
                  d="M 100 39 L 100 42 M 100 98 L 100 101 M 69 70 L 72 70 M 128 70 L 131 70"
                  stroke="#D4AF37"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                />

                {/* Inner Dashed Ring */}
                <motion.circle
                  cx="100"
                  cy="70"
                  r="18"
                  stroke="#D4AF37"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ delay: 1.3, duration: 0.7, ease: "easeInOut" }}
                />

                {/* Major Compass Rays */}
                <motion.path
                  d="M 100 44 L 100 96 M 74 70 L 126 70"
                  stroke="#D4AF37"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ delay: 1.4, duration: 0.7, ease: "easeInOut" }}
                />

                {/* Lotus Petals (Wisdom & Guidance Bloom) */}
                <motion.path
                  d="M 100 70 Q 94 58 100 50 Q 106 58 100 70"
                  stroke="#D4AF37" strokeWidth="1" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.3, duration: 0.8, ease: "easeInOut" }}
                />
                <motion.path
                  d="M 100 70 Q 112 64 120 70 Q 112 76 100 70"
                  stroke="#D4AF37" strokeWidth="1" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.3, duration: 0.8, ease: "easeInOut" }}
                />
                <motion.path
                  d="M 100 70 Q 106 82 100 90 Q 94 82 100 70"
                  stroke="#D4AF37" strokeWidth="1" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.3, duration: 0.8, ease: "easeInOut" }}
                />
                <motion.path
                  d="M 100 70 Q 88 76 80 70 Q 88 64 100 70"
                  stroke="#D4AF37" strokeWidth="1" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.3, duration: 0.8, ease: "easeInOut" }}
                />

                {/* Diagonal secondary petals */}
                <motion.path
                  d="M 100 70 Q 107 53 122 48 Q 117 63 100 70"
                  stroke="#D4AF37" strokeWidth="0.8" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 0.7, ease: "easeInOut" }}
                />
                <motion.path
                  d="M 100 70 Q 117 77 122 92 Q 107 87 100 70"
                  stroke="#D4AF37" strokeWidth="0.8" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 0.7, ease: "easeInOut" }}
                />
                <motion.path
                  d="M 100 70 Q 93 87 78 92 Q 83 77 100 70"
                  stroke="#D4AF37" strokeWidth="0.8" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 0.7, ease: "easeInOut" }}
                />
                <motion.path
                  d="M 100 70 Q 83 53 78 48 Q 93 53 100 70"
                  stroke="#D4AF37" strokeWidth="0.8" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 0.7, ease: "easeInOut" }}
                />

                {/* Center Star Point */}
                <motion.polygon
                  points="100,63 102,68 107,70 102,72 100,77 98,72 93,70 98,68"
                  fill="#D4AF37"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
                  style={{ transformOrigin: '100px 70px' }}
                />
              </svg>

              {/* Sparkle burst from the summit (2.6s) */}
              <div className={styles.burstContainer}>
                {Array.from({ length: 18 }).map((_, idx) => {
                  const angle = (idx * 360) / 18;
                  const distance = 80 + Math.random() * 45;
                  const rad = (angle * Math.PI) / 180;
                  const startX = 0;
                  const startY = -30; // Shift relative to center to match summit (100, 70)
                  const targetX = startX + Math.cos(rad) * distance;
                  const targetY = startY + Math.sin(rad) * distance;

                  return (
                    <motion.div
                      key={idx}
                      className={styles.burstParticle}
                      initial={{ x: startX, y: startY, scale: 0.8, opacity: 0 }}
                      animate={{ 
                        x: [startX, targetX], 
                        y: [startY, targetY], 
                        scale: [0.8, 1.1, 0], 
                        opacity: [0, 1, 0] 
                      }}
                      transition={{ 
                        delay: 2.6, 
                        duration: 0.9, 
                        ease: "easeOut"
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* Brand Text Wrapper */}
            <motion.div
              className={styles.brandWrapper}
              exit={{ 
                opacity: 0, 
                y: 25, 
                transition: { duration: 0.5, ease: "easeInOut" } 
              }}
            >
              {/* Confident staggered letters fade-in (1.3s - 2.0s) */}
              <motion.div
                className={styles.title}
                variants={titleContainerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}
              >
                {titleLetters.map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    style={{ display: 'inline-block' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>

              {/* Subtitle / Tagline (2.0s - 2.6s) */}
              <motion.p
                className={styles.tagline}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { 
                    opacity: 0.7, 
                    y: 0,
                    transition: { delay: 1.9, duration: 0.8, ease: "easeOut" } 
                  }
                }}
              >
                Your Trusted Companion
              </motion.p>

              {/* Glowing Line Sweep (2.6s - 3.0s) */}
              <div style={{ position: 'relative', marginTop: '24px', width: '160px', height: '1px' }}>
                {/* Base divider line */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(212, 175, 55, 0.2)'
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2.3, duration: 0.6, ease: "easeOut" }}
                />
                {/* Left-to-right laser flare sweep */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    width: '50px',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #FFFFFF 40%, #D4AF37 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(0.5px)'
                  }}
                  initial={{ left: '-25px', opacity: 0 }}
                  animate={{ left: ['-25px', '135px'], opacity: [0, 1, 1, 0] }}
                  transition={{ delay: 2.6, duration: 0.9, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom Divine Mantram */}
          <motion.div
            className={styles.sanskritText}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ delay: 2.1, duration: 0.9, ease: "easeOut" }}
            exit={{ opacity: 0 }}
          >
            || ॐ नमो वेंकटेशाय ||
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
