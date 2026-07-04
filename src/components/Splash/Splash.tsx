'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo/Logo';
import styles from './Splash.module.css';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cinematic animation sequence (3.8 seconds total)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 600); // Quick transition out
    }, 3800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setIsVisible(false);
    onFinish();
  };

  // Generate 12 simple floating particles for ambiance
  const particles = Array.from({ length: 12 });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.splash}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Custom Generated Cinematic Background (Revealed via central split mask) */}
          <motion.div
            className={styles.bgImage}
            initial={{ 
              clipPath: 'inset(0% 50% 0% 50%)',
              scale: 1.1 
            }}
            animate={{ 
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1.04 
            }}
            transition={{ 
              clipPath: { delay: 0.9, duration: 1.4, ease: [0.76, 0, 0.24, 1] },
              scale: { delay: 0.9, duration: 3.5, ease: "easeOut" }
            }}
          />

          {/* Vignette Overlay for Premium Depth */}
          <div className={styles.vignette} />

          {/* Golden Journey Line (Draws down, then expands/fades into the reveal) */}
          <motion.div 
            className={styles.pathLine}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0, 1, 1, 0] }}
            transition={{ 
              scaleY: { duration: 0.9, ease: [0.25, 1, 0.5, 1] },
              opacity: { times: [0, 0.15, 0.75, 1], duration: 1.8, delay: 0.1 }
            }}
            style={{ transformOrigin: 'top' }}
          />

          {/* Skip Button */}
          <motion.button
            className={styles.skipBtn}
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>

          {/* Floating Subtle Ambient Particles */}
          <div className={styles.particleContainer}>
            {particles.map((_, i) => (
              <motion.div
                key={i}
                className={styles.particle}
                initial={{
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 600 - 300,
                  opacity: Math.random() * 0.35 + 0.1,
                  scale: Math.random() * 0.8 + 0.4
                }}
                animate={{
                  y: ['15%', '-15%'],
                  x: ['-5%', '5%'],
                  opacity: [0.1, 0.5, 0.1]
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Central Logo Reveal with brand text */}
          <div className={styles.content}>
            <div className={styles.logoContainer}>
              <motion.div 
                className={styles.logoAura}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.35, 0.6, 0.35]
                }}
                transition={{ delay: 1.4, duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ 
                  scale: { delay: 1.3, duration: 1.1, ease: [0.34, 1.56, 0.64, 1] },
                  opacity: { delay: 1.3, duration: 0.8 },
                  y: { delay: 1.3, duration: 1.0, ease: "easeOut" }
                }}
                style={{ zIndex: 25 }}
              >
                <Logo size={130} />
              </motion.div>
            </div>

            {/* Premium cinematic brand text animation */}
            <motion.div
              className={styles.brandWrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            >
              <h1 className={styles.title}>SAARTHI</h1>
              <p className={styles.tagline}>Your Spiritual Companion</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
