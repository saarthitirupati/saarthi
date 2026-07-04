'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './Splash.module.css';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      {/* Simulated Video Background using Ken Burns effect */}
      <motion.div 
        className={styles.splashImage}
        initial={{ scale: 1 }}
        animate={{ scale: 1.15 }}
        transition={{ duration: 6, ease: "linear" }}
      />
      
      <div className={styles.overlay} />

      <motion.div 
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          className={styles.brandContainer}
        >
          <h1 className={styles.brandName}>Saarthi</h1>
          <p className={styles.tagline}>पथ की खोज करें</p>
        </motion.div>
      </motion.div>

      {/* Modern Minimal Progress Bar */}
      <motion.div 
        className={styles.loadingContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className={styles.progressBarBg}>
          <motion.div 
            className={styles.progressBarFill}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: 'easeInOut', delay: 1 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
