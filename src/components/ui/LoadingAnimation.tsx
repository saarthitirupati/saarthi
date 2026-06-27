'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import styles from './LoadingAnimation.module.css';

export default function LoadingAnimation() {
  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.logoContainer}
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles size={60} className={styles.logoIcon} />
      </motion.div>
      
      <motion.h3 
        className={styles.title}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Creating your plan...
      </motion.h3>

      <div className={styles.progressContainer}>
        <motion.div 
          className={styles.progressBar}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
      </div>

      <motion.p 
        className={styles.status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Finding perfect places for you...
      </motion.p>
    </div>
  );
}
